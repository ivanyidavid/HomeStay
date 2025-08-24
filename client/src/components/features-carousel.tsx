import { useState, useEffect } from "react";

const carouselFeatures = [
  {
    id: 1,
    emoji: "🏔️",
    title: "Panoramic Views",
    description: "Mesmerizing landscapes"
  },
  {
    id: 2,
    emoji: "🏠",
    title: "Spacious Accommodation",
    description: "Perfect for large groups"
  },
  {
    id: 3,
    emoji: "🚗",
    title: "Easy Access",
    description: "Parking for up to 3 cars"
  },
  {
    id: 4,
    emoji: "🌿",
    title: "Garden Paradise",
    description: "Big garden & spice garden"
  },
  {
    id: 5,
    emoji: "🚊",
    title: "Connected Location",
    description: "35 min from Budapest"
  },
  {
    id: 6,
    emoji: "🏨",
    title: "Flexible Booking",
    description: "Possible to book only 1 room"
  },
  {
    id: 7,
    emoji: "📶",
    title: "High-Speed Wifi",
    description: "Fast internet connection"
  },
  {
    id: 8,
    emoji: "💻",
    title: "Dedicated Workspace",
    description: "Perfect for remote work"
  },
  {
    id: 9,
    emoji: "❄️",
    title: "Air Conditioning",
    description: "Stay cool and comfortable"
  }
];

export default function FeaturesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % carouselFeatures.length
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-airbnb-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-airbnb-dark text-center mb-12">
          What Makes Us Special
        </h2>
        
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 320}px)` }}
          >
            {carouselFeatures.map((feature) => (
              <div 
                key={feature.id}
                className="flex-shrink-0 w-80 bg-white rounded-xl p-6 shadow-lg text-center mx-4"
                data-testid={`carousel-feature-${feature.id}`}
              >
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h3 className="text-lg font-semibold text-airbnb-dark mb-2">
                  {feature.title}
                </h3>
                <p className="text-airbnb-gray text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Carousel indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {carouselFeatures.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-airbnb-red' : 'bg-gray-300'
              }`}
              data-testid={`carousel-indicator-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
