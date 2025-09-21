import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import OptimizedImage from "@/components/OptimizedImage";
import type { ImageKey } from "@/lib/imageMap";

const galleryImages: Array<{ id: number; imageKey: ImageKey; title: string }> = [
  // Bathrooms
  { id: 1, imageKey: "bathroom downstairs-DSC_8881", title: "Bathroom Downstairs - DSC_8881" },
  { id: 2, imageKey: "bathroom downstairs-DSC_8886", title: "Bathroom Downstairs - DSC_8886" },
  { id: 3, imageKey: "bathroom upper-IMG_0093-HDR", title: "Bathroom Upper - IMG_0093-HDR" },
  { id: 4, imageKey: "bathroom upper-IMG_0101", title: "Bathroom Upper - IMG_0101" },
  
  // Bedrooms
  { id: 5, imageKey: "bedroom1-IMG_9992-HDR", title: "Bedroom1 - IMG_9992-HDR" },
  { id: 6, imageKey: "bedroom1-IMG_9996", title: "Bedroom1 - IMG_9996" },
  { id: 7, imageKey: "bedroom1-IMG_9998", title: "Bedroom1 - IMG_9998" },
  { id: 8, imageKey: "bedroom2-DSC_8860-HDR", title: "Bedroom2 - DSC_8860-HDR" },
  { id: 9, imageKey: "bedroom2-DSC_8870", title: "Bedroom2 - DSC_8870" },
  { id: 10, imageKey: "bedroom2-DSC_8871-HDR", title: "Bedroom2 - DSC_8871-HDR" },
  { id: 11, imageKey: "bedroom2-IMG_0021", title: "Bedroom2 - IMG_0021" },
  { id: 12, imageKey: "bedroom2-IMG_0027", title: "Bedroom2 - IMG_0027" },
  
  // Bunk Bedroom
  { id: 13, imageKey: "bunk bedroom-DSC_8843", title: "Bunk Bedroom - DSC_8843" },
  { id: 14, imageKey: "bunk bedroom-DSC_8845", title: "Bunk Bedroom - DSC_8845" },
  { id: 15, imageKey: "bunk bedroom-DSC_8848", title: "Bunk Bedroom - DSC_8848" },
  { id: 16, imageKey: "bunk bedroom-DSC_8850", title: "Bunk Bedroom - DSC_8850" },
  { id: 17, imageKey: "bunk bedroom-IMG_0001-HDR", title: "Bunk Bedroom - IMG_0001-HDR" },
  { id: 18, imageKey: "bunk bedroom-IMG_0015", title: "Bunk Bedroom - IMG_0015" },
  
  // Special Photo
  { id: 19, imageKey: "IMG_5816", title: "Hill View - IMG_5816" },
  
  // Common Room
  { id: 20, imageKey: "common room-DSC_8961", title: "Common Room - DSC_8961" },
  { id: 21, imageKey: "common room-IMG_0068-HDR", title: "Common Room - IMG_0068-HDR" },
  { id: 22, imageKey: "common room-IMG_0083-HDR", title: "Common Room - IMG_0083-HDR" },
  
  // Kitchen
  { id: 23, imageKey: "kitchen-DSC_8902", title: "Kitchen - DSC_8902" },
  { id: 24, imageKey: "kitchen-DSC_8914", title: "Kitchen - DSC_8914" },
  { id: 25, imageKey: "kitchen-DSC_8917-HDR", title: "Kitchen - DSC_8917-HDR" },
  { id: 26, imageKey: "kitchen-DSC_8923", title: "Kitchen - DSC_8923" },
  { id: 27, imageKey: "kitchen-DSC_8930-HDR", title: "Kitchen - DSC_8930-HDR" },
  { id: 28, imageKey: "kitchen-DSC_8933-HDR", title: "Kitchen - DSC_8933-HDR" },
  { id: 29, imageKey: "kitchen-IMG_0048-HDR", title: "Kitchen - IMG_0048-HDR" },
  { id: 30, imageKey: "kitchen-IMG_0061", title: "Kitchen - IMG_0061" },
  { id: 31, imageKey: "kitchen-IMG_0062", title: "Kitchen - IMG_0062" },
  { id: 32, imageKey: "kitchen-IMG_0064", title: "Kitchen - IMG_0064" },
  { id: 33, imageKey: "kitchen-IMG_0066", title: "Kitchen - IMG_0066" },
  
  // Outside Views
  { id: 34, imageKey: "outside-DSC_8970", title: "Outside - DSC_8970" },
  { id: 35, imageKey: "outside-DSC_8972", title: "Outside - DSC_8972" },
  { id: 36, imageKey: "outside-DSC_8974", title: "Outside - DSC_8974" },
  { id: 37, imageKey: "outside-DSC_8978", title: "Outside - DSC_8978" },
  { id: 38, imageKey: "outside-DSC_8981", title: "Outside - DSC_8981" },
  { id: 39, imageKey: "outside-DSC_8985", title: "Outside - DSC_8985" },
  { id: 40, imageKey: "outside-IMG_0117", title: "Outside - IMG_0117" },
  { id: 41, imageKey: "outside-IMG_0118", title: "Outside - IMG_0118" },
  
  // Additional Photos (converted from HEIC)
  { id: 42, imageKey: "IMG_5538", title: "House View - IMG_5538" },
  { id: 43, imageKey: "IMG_9806", title: "Property View - IMG_9806" },
  { id: 44, imageKey: "IMG_6039", title: "Panoramic View - IMG_6039" },
  
  // Stairs
  { id: 45, imageKey: "stairs-IMG_9969", title: "Stairs - IMG_9969" },
  
  // Terrace
  { id: 46, imageKey: "terrace-DSC_8897", title: "Terrace - DSC_8897" },
  { id: 47, imageKey: "terrace-DSC_8898", title: "Terrace - DSC_8898" },
  { id: 48, imageKey: "terrace-DSC_8899", title: "Terrace - DSC_8899" },
  { id: 49, imageKey: "terrace-DSC_8967", title: "Terrace - DSC_8967" },
  { id: 50, imageKey: "terrace-DSC_8968", title: "Terrace - DSC_8968" },
  { id: 51, imageKey: "terrace-DSC_8969", title: "Terrace - DSC_8969" },
  { id: 52, imageKey: "terrace-IMG_0030", title: "Terrace - IMG_0030" },
  { id: 53, imageKey: "terrace-IMG_0104", title: "Terrace - IMG_0104" },
  { id: 54, imageKey: "terrace-IMG_0106", title: "Terrace - IMG_0106" },
  { id: 55, imageKey: "terrace-IMG_0113", title: "Terrace - IMG_0113" }
];

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);
  
  const goToPrevious = () => {
    if (!selectedImage) return;
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : galleryImages.length - 1;
    setSelectedImage(galleryImages[previousIndex]);
  };
  
  const goToNext = () => {
    if (!selectedImage) return;
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = currentIndex < galleryImages.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(galleryImages[nextIndex]);
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedImage) return;
      
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      } else if (event.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    
    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedImage]);

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-airbnb-dark text-center mb-12">
          Photo Gallery
        </h2>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {galleryImages.map((image) => (
              <CarouselItem key={image.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div
                  className="aspect-[4/3] overflow-hidden rounded-lg cursor-pointer hover:shadow-lg transition-shadow relative"
                  onClick={() => setSelectedImage(image)}
                  data-testid={`gallery-image-${image.id}`}
                >
                  <OptimizedImage
                    imageKey={image.imageKey}
                    className="w-full h-full"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    objectFit="cover"
                    priority={image.id <= 6} // Prioritize first 6 images
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
        
      </div>

      {/* Full-size image modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0 overflow-hidden">
          {selectedImage && (
            <div className="relative w-full h-full bg-black">
              {/* Close button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                data-testid="modal-close-button"
              >
                <X size={24} />
              </button>
              
              {/* Navigation arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                data-testid="modal-prev-button"
              >
                <ChevronLeft size={32} />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                data-testid="modal-next-button"
              >
                <ChevronRight size={32} />
              </button>
              
              {/* Main image */}
              <div className="w-full h-full flex items-center justify-center p-4">
                <OptimizedImage
                  imageKey={selectedImage.imageKey}
                  className="max-w-full max-h-full"
                  objectFit="contain"
                  sizes="90vw"
                  priority={true}
                />
              </div>
              
              {/* Image counter */}
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-white/80 text-sm">
                  {galleryImages.findIndex(img => img.id === selectedImage.id) + 1} of {galleryImages.length}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}