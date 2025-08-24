import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import TestimonialsSection from "@/components/testimonials-section";
import AmenitiesSection from "@/components/amenities-section";
import FeaturesSection from "@/components/features-section";
import FeaturesCarousel from "@/components/features-carousel";
import GallerySection from "@/components/gallery-section";
import BookingSection from "@/components/booking-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="font-inter bg-white">
      <Navigation />
      <HeroSection />
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-airbnb-dark mb-4">
              What Makes Us Special
            </h2>
            <p className="text-lg text-airbnb-gray max-w-3xl mx-auto">
              Our guest house will give you an unforgettable escape from the hustle of everyday life. 
              Ideal for groups of friends, team buildings, parties, and retreats.
            </p>
          </div>
        </div>
      </div>
      <AmenitiesSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FeaturesCarousel />
      <GallerySection />
      <BookingSection />
      <Footer />
    </div>
  );
}
