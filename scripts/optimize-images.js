const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../attached_assets/photos');
const outputDir = path.join(__dirname, '../attached_assets/photos/webp');
const imageMap = {};

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Responsive widths to generate
const widths = [320, 640, 960, 1280, 1600];

async function processImage(inputPath, filename) {
  console.log(`Processing: ${filename}`);
  
  const baseName = path.parse(filename).name;
  const ext = path.parse(filename).ext.toLowerCase();
  
  // Skip if already processed or not an image
  if (!ext.match(/\.(jpg|jpeg|png|heic)$/i)) {
    return;
  }

  try {
    // Get original image metadata
    const metadata = await sharp(inputPath).metadata();
    const originalWidth = metadata.width;
    
    // Initialize image map entry
    imageMap[baseName] = {
      webp: {},
      fallback: `photos/${filename}`,
      alt: baseName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    };

    // Generate WebP variants for each width
    for (const width of widths) {
      // Skip if requested width is larger than original
      if (width > originalWidth) continue;
      
      const outputPath = path.join(outputDir, `${baseName}-${width}.webp`);
      
      await sharp(inputPath)
        .resize(width, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ 
          quality: filename.includes('exterior') || filename.includes('view') ? 80 : 75,
          effort: 6 
        })
        .toFile(outputPath);
      
      imageMap[baseName].webp[width] = `photos/webp/${baseName}-${width}.webp`;
    }

    // Generate a tiny blur placeholder (LQIP)
    const lqipPath = path.join(outputDir, `${baseName}-blur.webp`);
    await sharp(inputPath)
      .resize(20, null, { fit: 'inside' })
      .webp({ quality: 20 })
      .blur(1)
      .toFile(lqipPath);
    
    imageMap[baseName].lqip = `photos/webp/${baseName}-blur.webp`;
    
    console.log(`✓ Generated ${Object.keys(imageMap[baseName].webp).length} WebP variants for ${filename}`);
    
  } catch (error) {
    console.error(`Error processing ${filename}:`, error.message);
  }
}

async function generateImageMap() {
  try {
    const files = fs.readdirSync(inputDir);
    
    // Process images in parallel batches to avoid overwhelming the system
    const batchSize = 5;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      await Promise.all(
        batch.map(filename => {
          const inputPath = path.join(inputDir, filename);
          const stats = fs.statSync(inputPath);
          if (stats.isFile()) {
            return processImage(inputPath, filename);
          }
        })
      );
    }

    // Write the image map
    const mapPath = path.join(__dirname, '../client/src/lib/imageMap.ts');
    const mapContent = `// Auto-generated image map for optimized images
// Run 'node scripts/optimize-images.js' to regenerate

export const imageMap = ${JSON.stringify(imageMap, null, 2)} as const;

export type ImageKey = keyof typeof imageMap;
`;

    fs.writeFileSync(mapPath, mapContent);
    
    console.log(`\n🎉 Image optimization complete!`);
    console.log(`📊 Processed ${Object.keys(imageMap).length} images`);
    console.log(`📝 Generated image map at: ${mapPath}`);
    console.log(`📁 WebP files saved to: ${outputDir}`);
    
  } catch (error) {
    console.error('Error during image optimization:', error);
    process.exit(1);
  }
}

generateImageMap();