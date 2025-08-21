import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Import your actual photos
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
import stairsIMG9969 from "@assets/photos/stairs-IMG_9969.jpg";

const galleryImages = [
  {
    id: 1,
    src: terraceIMG0106,
    alt: "Terrace with panoramic views",
    title: "Outdoor Terrace - IMG_0106"
  },
  {
    id: 2,
    src: terraceDSC8897,
    alt: "Terrace area",
    title: "Beautiful Terrace - DSC_8897"
  },
  {
    id: 3,
    src: terraceDSC8898,
    alt: "Terrace space",
    title: "Spacious Terrace - DSC_8898"
  },
  {
    id: 4,
    src: terraceDSC8899,
    alt: "Terrace balcony",
    title: "Terrace Balcony - DSC_8899"
  },
  {
    id: 5,
    src: terraceDSC8967,
    alt: "Terrace view",
    title: "Terrace Views - DSC_8967"
  },
  {
    id: 6,
    src: terraceDSC8968,
    alt: "Outdoor space",
    title: "Outdoor Space - DSC_8968"
  },
  {
    id: 7,
    src: terraceDSC8969,
    alt: "Balcony area",
    title: "Balcony Area - DSC_8969"
  },
  {
    id: 8,
    src: terraceIMG0030,
    alt: "Terrace seating",
    title: "Terrace Seating - IMG_0030"
  },
  {
    id: 9,
    src: terraceIMG0104,
    alt: "Terrace space",
    title: "Terrace Space - IMG_0104"
  },
  {
    id: 10,
    src: terraceIMG0113,
    alt: "Terrace area",
    title: "Terrace Area - IMG_0113"
  },
  {
    id: 11,
    src: stairsIMG9969,
    alt: "Interior stairs",
    title: "Beautiful Stairs - IMG_9969"
  }
];

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-airbnb-dark text-center mb-12">
          Photo Gallery
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="w-full h-48 overflow-hidden rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-airbnb-red"
              data-testid={`gallery-image-${image.id}`}
            >
              <img 
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Image modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full p-0">
          {selectedImage && (
            <div className="relative">
              <img 
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[80vh] object-contain"
                data-testid="modal-image"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                <h3 className="text-lg font-semibold">{selectedImage.title}</h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
