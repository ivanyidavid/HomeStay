import { useState } from 'react';
import type { ImageKey } from '@/lib/imageMap';
import { imageMap } from '@/lib/imageMap';

interface OptimizedImageProps {
  imageKey: ImageKey;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  width?: number;
  height?: number;
  onLoad?: () => void;
  onClick?: () => void;
}

export default function OptimizedImage({
  imageKey,
  alt,
  className = '',
  sizes = '100vw',
  priority = false,
  objectFit = 'cover',
  width,
  height,
  onLoad,
  onClick
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const imageData = imageMap[imageKey];
  
  if (!imageData) {
    console.warn(`Image not found: ${imageKey}`);
    return null;
  }

  // Generate srcSet for WebP variants
  const webpSrcSet = Object.entries(imageData.webp)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([width, path]) => `/assets/${path} ${width}w`)
    .join(', ');

  // Fallback srcSet for JPG (use original image at different sizes)
  const fallbackSrc = `/assets/${imageData.fallback}`;

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const imgStyle = {
    objectFit,
    transition: 'opacity 0.3s ease',
    opacity: isLoading ? 0 : 1,
    ...(isLoading && imageData.lqip && {
      backgroundImage: `url(/assets/${imageData.lqip})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    })
  };

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <picture className={className} onClick={onClick}>
      {/* WebP source with srcSet */}
      <source
        srcSet={webpSrcSet}
        sizes={sizes}
        type="image/webp"
      />
      
      {/* Fallback IMG */}
      <img
        src={fallbackSrc}
        alt={alt || imageData.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={priority ? 'high' : 'auto'}
        style={imgStyle}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className="w-full h-full"
      />
      
      {/* Loading placeholder */}
      {isLoading && imageData.lqip && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url(/assets/${imageData.lqip})` }}
        />
      )}
    </picture>
  );
}