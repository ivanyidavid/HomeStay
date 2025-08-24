import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import WhatMakesUsSpecialSection from "@/components/what-makes-us-special";
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
      <WhatMakesUsSpecialSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FeaturesCarousel />
      <GallerySection />
      <AmenitiesSection />
      <BookingSection />
      <Footer />
    </div>
  );
}
