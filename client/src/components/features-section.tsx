import { Card, CardContent } from "@/components/ui/card";

// Import actual photos for features
import img6039 from "@assets/photos/IMG_6039.jpg";
import bedroom1IMG9992 from "@assets/photos/bedroom1-IMG_9992-HDR.jpg";
import kitchenDSC8917 from "@assets/photos/kitchen-DSC_8917-HDR.jpg";
import commonRoomDSC8961 from "@assets/photos/common room-DSC_8961.jpg";
import bathroomDownstairsDSC8881 from "@assets/photos/bathroom downstairs-DSC_8881.jpg";
import terraceIMG0106 from "@assets/photos/terrace-IMG_0106.jpg";

const features = [
  {
    id: 1,
    title: "🌄 Peaceful & Mesmerizing Views",
    description: "Breathtaking panoramic views of the hills that will leave you speechless. Perfect for morning coffee and evening relaxation.",
    image: img6039,
    alt: "Panoramic hills view",
    note: "Using actual photo IMG_6039 (converted from HEIC)"
  },
  {
    id: 2,
    title: "👥 Hosts Up to 11 Guests",
    description: "Ideal for individuals or couples who want to spend a few days to work, create or relax away from the city, but also for thematic retreats and team buildings.",
    image: bedroom1IMG9992,
    alt: "Comfortable bedroom",
    note: "Using actual photo bedroom1-IMG_9992-HDR"
  },
  {
    id: 3,
    title: "🍳 Fully-Equipped Stylish Kitchen",
    description: "Cook together in our modern, fully-equipped kitchen. Everything you need for memorable meals and group cooking experiences.",
    image: kitchenDSC8917,
    alt: "Stylish kitchen",
    note: "Using actual photo kitchen-DSC_8917-HDR"
  },
  {
    id: 4,
    title: "🛋️ Vast Living Room",
    description: "Extra-large couch and sofa-bed perfect for socializing. The heart of your stay where memories are made.",
    image: commonRoomDSC8961,
    alt: "Spacious living room",
    note: "Using actual photo common room-DSC_8961"
  },
  {
    id: 5,
    title: "🚿 Spectacular Bathrooms",
    description: "Two fully-equipped bathrooms with modern fixtures. Never wait in line, even with a full house.",
    image: bathroomDownstairsDSC8881,
    alt: "Modern bathroom",
    note: "Using actual photo bathroom downstairs-DSC_8881"
  },
  {
    id: 6,
    title: "🌅 Large Balconies",
    description: "Spacious balconies on both floors for outdoor relaxation and taking in those incredible hill views.",
    image: terraceIMG0106,
    alt: "Terrace balcony",
    note: "Using actual terrace photo - terrace-IMG_0106"
  }
];

export default function FeaturesSection() {
  return (
    <>
      {/* First section with features 1-3 */}
      <section id="features" className="py-16 bg-airbnb-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-airbnb-dark text-center mb-12">
            Why Choose Our Guest House
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {features.slice(0, 3).map((feature) => (
              <Card key={feature.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={feature.image}
                  alt={feature.alt}
                  className="w-full h-64 object-cover"
                  data-testid={`feature-image-${feature.id}`}
                />
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-airbnb-dark mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-airbnb-gray">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Second section with features 4-6 */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {features.slice(3, 6).map((feature) => (
              <Card key={feature.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <img 
                  src={feature.image}
                  alt={feature.alt}
                  className="w-full h-64 object-cover"
                  data-testid={`feature-image-${feature.id}`}
                />
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-airbnb-dark mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-airbnb-gray">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
