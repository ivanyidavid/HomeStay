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

// Import all your uploaded photos
import bathroomDownstairsDSC8881 from "@assets/photos/bathroom downstairs-DSC_8881.jpg";
import bathroomDownstairsDSC8886 from "@assets/photos/bathroom downstairs-DSC_8886.jpg";
import bathroomUpperIMG0093 from "@assets/photos/bathroom upper-IMG_0093-HDR.jpg";
import bathroomUpperIMG0101 from "@assets/photos/bathroom upper-IMG_0101.jpg";
import bedroom1IMG9992 from "@assets/photos/bedroom1-IMG_9992-HDR.jpg";
import bedroom1IMG9996 from "@assets/photos/bedroom1-IMG_9996.jpg";
import bedroom1IMG9998 from "@assets/photos/bedroom1-IMG_9998.jpg";
import bedroom2DSC8860 from "@assets/photos/bedroom2-DSC_8860-HDR.jpg";
import bedroom2DSC8870 from "@assets/photos/bedroom2-DSC_8870.jpg";
import bedroom2DSC8871 from "@assets/photos/bedroom2-DSC_8871-HDR.jpg";
import bedroom2IMG0021 from "@assets/photos/bedroom2-IMG_0021.jpg";
import bedroom2IMG0027 from "@assets/photos/bedroom2-IMG_0027.jpg";
import bunkBedroomDSC8843 from "@assets/photos/bunk bedroom-DSC_8843.jpg";
import bunkBedroomDSC8845 from "@assets/photos/bunk bedroom-DSC_8845.jpg";
import bunkBedroomDSC8848 from "@assets/photos/bunk bedroom-DSC_8848.jpg";
import bunkBedroomDSC8850 from "@assets/photos/bunk bedroom-DSC_8850.jpg";
import bunkBedroomIMG0001 from "@assets/photos/bunk bedroom-IMG_0001-HDR.jpg";
import bunkBedroomIMG0015 from "@assets/photos/bunk bedroom-IMG_0015.jpg";
import img5816 from "@assets/photos/IMG_5816.jpg";
import commonRoomDSC8961 from "@assets/photos/common room-DSC_8961.jpg";
import commonRoomIMG0068 from "@assets/photos/common room-IMG_0068-HDR.jpg";
import commonRoomIMG0083 from "@assets/photos/common room-IMG_0083-HDR.jpg";
import kitchenDSC8902 from "@assets/photos/kitchen-DSC_8902.jpg";
import kitchenDSC8914 from "@assets/photos/kitchen-DSC_8914.jpg";
import kitchenDSC8917 from "@assets/photos/kitchen-DSC_8917-HDR.jpg";
import kitchenDSC8923 from "@assets/photos/kitchen-DSC_8923.jpg";
import kitchenDSC8930 from "@assets/photos/kitchen-DSC_8930-HDR.jpg";
import kitchenDSC8933 from "@assets/photos/kitchen-DSC_8933-HDR.jpg";
import kitchenIMG0048 from "@assets/photos/kitchen-IMG_0048-HDR.jpg";
import kitchenIMG0061 from "@assets/photos/kitchen-IMG_0061.jpg";
import kitchenIMG0062 from "@assets/photos/kitchen-IMG_0062.jpg";
import kitchenIMG0064 from "@assets/photos/kitchen-IMG_0064.jpg";
import kitchenIMG0066 from "@assets/photos/kitchen-IMG_0066.jpg";
import outsideDSC8970 from "@assets/photos/outside-DSC_8970.jpg";
import outsideDSC8972 from "@assets/photos/outside-DSC_8972.jpg";
import outsideDSC8974 from "@assets/photos/outside-DSC_8974.jpg";
import outsideDSC8978 from "@assets/photos/outside-DSC_8978.jpg";
import outsideDSC8981 from "@assets/photos/outside-DSC_8981.jpg";
import outsideDSC8985 from "@assets/photos/outside-DSC_8985.jpg";
import outsideIMG0117 from "@assets/photos/outside-IMG_0117.jpg";
import outsideIMG0118 from "@assets/photos/outside-IMG_0118.jpg";
import img5538 from "@assets/photos/IMG_5538.jpg";
import img9806 from "@assets/photos/IMG_9806.jpg";
import img6039 from "@assets/photos/IMG_6039.jpg";
import stairsIMG9969 from "@assets/photos/stairs-IMG_9969.jpg";
import terraceDSC8897 from "@assets/photos/terrace-DSC_8897.jpg";
import terraceDSC8898 from "@assets/photos/terrace-DSC_8898.jpg";
import terraceDSC8899 from "@assets/photos/terrace-DSC_8899.jpg";
import terraceDSC8967 from "@assets/photos/terrace-DSC_8967.jpg";
import terraceDSC8968 from "@assets/photos/terrace-DSC_8968.jpg";
import terraceDSC8969 from "@assets/photos/terrace-DSC_8969.jpg";
import terraceIMG0030 from "@assets/photos/terrace-IMG_0030.jpg";
import terraceIMG0104 from "@assets/photos/terrace-IMG_0104.jpg";
import terraceIMG0106 from "@assets/photos/terrace-IMG_0106.jpg";
import terraceIMG0113 from "@assets/photos/terrace-IMG_0113.jpg";

const galleryImages = [
  // Bathrooms
  { id: 1, src: bathroomDownstairsDSC8881, alt: "Downstairs bathroom", title: "Bathroom Downstairs - DSC_8881" },
  { id: 2, src: bathroomDownstairsDSC8886, alt: "Downstairs bathroom detail", title: "Bathroom Downstairs - DSC_8886" },
  { id: 3, src: bathroomUpperIMG0093, alt: "Upper bathroom", title: "Bathroom Upper - IMG_0093-HDR" },
  { id: 4, src: bathroomUpperIMG0101, alt: "Upper bathroom detail", title: "Bathroom Upper - IMG_0101" },
  
  // Bedroom 1
  { id: 5, src: bedroom1IMG9992, alt: "First bedroom", title: "Bedroom 1 - IMG_9992-HDR" },
  { id: 6, src: bedroom1IMG9996, alt: "First bedroom view", title: "Bedroom 1 - IMG_9996" },
  { id: 7, src: bedroom1IMG9998, alt: "First bedroom detail", title: "Bedroom 1 - IMG_9998" },
  
  // Bedroom 2
  { id: 8, src: bedroom2DSC8860, alt: "Second bedroom", title: "Bedroom 2 - DSC_8860-HDR" },
  { id: 9, src: bedroom2DSC8870, alt: "Second bedroom view", title: "Bedroom 2 - DSC_8870" },
  { id: 10, src: bedroom2DSC8871, alt: "Second bedroom detail", title: "Bedroom 2 - DSC_8871-HDR" },
  { id: 11, src: bedroom2IMG0021, alt: "Second bedroom angle", title: "Bedroom 2 - IMG_0021" },
  { id: 12, src: bedroom2IMG0027, alt: "Second bedroom space", title: "Bedroom 2 - IMG_0027" },
  
  // Bunk Bedroom
  { id: 13, src: bunkBedroomDSC8843, alt: "Bunk bed room", title: "Bunk Bedroom - DSC_8843" },
  { id: 14, src: bunkBedroomDSC8845, alt: "Bunk bed area", title: "Bunk Bedroom - DSC_8845" },
  { id: 15, src: bunkBedroomDSC8848, alt: "Bunk bed space", title: "Bunk Bedroom - DSC_8848" },
  { id: 16, src: bunkBedroomDSC8850, alt: "Bunk bed room view", title: "Bunk Bedroom - DSC_8850" },
  { id: 17, src: bunkBedroomIMG0001, alt: "Bunk bedroom HDR", title: "Bunk Bedroom - IMG_0001-HDR" },
  { id: 18, src: bunkBedroomIMG0015, alt: "Bunk bedroom detail", title: "Bunk Bedroom - IMG_0015" },
  
  // Common Room
  { id: 19, src: img5816, alt: "Living room view", title: "Living Room - IMG_5816" },
  { id: 20, src: commonRoomDSC8961, alt: "Living room space", title: "Common Room - DSC_8961" },
  { id: 21, src: commonRoomIMG0068, alt: "Living room HDR", title: "Common Room - IMG_0068-HDR" },
  { id: 22, src: commonRoomIMG0083, alt: "Living room main", title: "Common Room - IMG_0083-HDR" },
  
  // Kitchen
  { id: 23, src: kitchenDSC8902, alt: "Kitchen area", title: "Kitchen - DSC_8902" },
  { id: 24, src: kitchenDSC8914, alt: "Kitchen view", title: "Kitchen - DSC_8914" },
  { id: 25, src: kitchenDSC8917, alt: "Kitchen main", title: "Kitchen - DSC_8917-HDR" },
  { id: 26, src: kitchenDSC8923, alt: "Kitchen detail", title: "Kitchen - DSC_8923" },
  { id: 27, src: kitchenDSC8930, alt: "Kitchen HDR", title: "Kitchen - DSC_8930-HDR" },
  { id: 28, src: kitchenDSC8933, alt: "Kitchen space", title: "Kitchen - DSC_8933-HDR" },
  { id: 29, src: kitchenIMG0048, alt: "Kitchen angle", title: "Kitchen - IMG_0048-HDR" },
  { id: 30, src: kitchenIMG0061, alt: "Kitchen view", title: "Kitchen - IMG_0061" },
  { id: 31, src: kitchenIMG0062, alt: "Kitchen detail", title: "Kitchen - IMG_0062" },
  { id: 32, src: kitchenIMG0064, alt: "Kitchen space", title: "Kitchen - IMG_0064" },
  { id: 33, src: kitchenIMG0066, alt: "Kitchen area", title: "Kitchen - IMG_0066" },
  
  // Outside Views
  { id: 34, src: outsideDSC8970, alt: "Exterior view", title: "Outside - DSC_8970" },
  { id: 35, src: outsideDSC8972, alt: "Exterior area", title: "Outside - DSC_8972" },
  { id: 36, src: outsideDSC8974, alt: "Exterior space", title: "Outside - DSC_8974" },
  { id: 37, src: outsideDSC8978, alt: "Exterior detail", title: "Outside - DSC_8978" },
  { id: 38, src: outsideDSC8981, alt: "Exterior view", title: "Outside - DSC_8981" },
  { id: 39, src: outsideDSC8985, alt: "Exterior panorama", title: "Outside - DSC_8985" },
  { id: 40, src: outsideIMG0117, alt: "Exterior main", title: "Outside - IMG_0117" },
  { id: 41, src: outsideIMG0118, alt: "Exterior angle", title: "Outside - IMG_0118" },
  
  // Additional Photos (converted from HEIC)
  { id: 42, src: img5538, alt: "House view", title: "House View - IMG_5538" },
  { id: 43, src: img9806, alt: "Property view", title: "Property View - IMG_9806" },
  { id: 44, src: img6039, alt: "Panoramic hills view", title: "Panoramic View - IMG_6039" },
  
  // Stairs
  { id: 45, src: stairsIMG9969, alt: "Interior stairs", title: "Stairs - IMG_9969" },
  
  // Terrace
  { id: 46, src: terraceDSC8897, alt: "Terrace area", title: "Terrace - DSC_8897" },
  { id: 47, src: terraceDSC8898, alt: "Terrace space", title: "Terrace - DSC_8898" },
  { id: 48, src: terraceDSC8899, alt: "Terrace balcony", title: "Terrace - DSC_8899" },
  { id: 49, src: terraceDSC8967, alt: "Terrace view", title: "Terrace - DSC_8967" },
  { id: 50, src: terraceDSC8968, alt: "Terrace outdoor", title: "Terrace - DSC_8968" },
  { id: 51, src: terraceDSC8969, alt: "Terrace balcony", title: "Terrace - DSC_8969" },
  { id: 52, src: terraceIMG0030, alt: "Terrace seating", title: "Terrace - IMG_0030" },
  { id: 53, src: terraceIMG0104, alt: "Terrace space", title: "Terrace - IMG_0104" },
  { id: 54, src: terraceIMG0106, alt: "Terrace panoramic", title: "Terrace - IMG_0106" },
  { id: 55, src: terraceIMG0113, alt: "Terrace area", title: "Terrace - IMG_0113" }
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
                <div className="p-1">
                  <button
                    onClick={() => setSelectedImage(image)}
                    className="w-full h-64 overflow-hidden rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-airbnb-red shadow-lg"
                    data-testid={`gallery-image-${image.id}`}
                  >
                    <img 
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-12" />
          <CarouselNext className="-right-12" />
        </Carousel>
        
        <div className="text-center mt-8">
          <p className="text-airbnb-gray">
            Swipe or use arrows to explore all {galleryImages.length} photos
          </p>
        </div>
      </div>

      {/* Image modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-6xl w-full p-0 bg-black">
          {selectedImage && (
            <div className="relative">
              <img 
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[90vh] object-contain"
                data-testid="modal-image"
              />
              
              {/* Previous button */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
                data-testid="modal-previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              {/* Next button */}
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
                data-testid="modal-next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Close button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
                data-testid="modal-close"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Photo counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
                {galleryImages.findIndex(img => img.id === selectedImage.id) + 1} of {galleryImages.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
