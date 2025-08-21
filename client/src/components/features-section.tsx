import { Card, CardContent } from "@/components/ui/card";

// Import actual photos for features
import terraceIMG0106 from "@assets/photos/terrace-IMG_0106.jpg";

const features = [
  {
    id: 1,
    title: "🌄 Peaceful & Mesmerizing Views",
    description: "Breathtaking panoramic views of the hills that will leave you speechless. Perfect for morning coffee and evening relaxation.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    alt: "Panoramic hills view",
    note: "Looking for IMG_6039"
  },
  {
    id: 2,
    title: "👥 Hosts Up to 11 Guests",
    description: "Ideal for groups, team buildings, parties, and retreats. Three bedrooms plus convertible living spaces ensure everyone has comfort.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400",
    alt: "Comfortable bedroom",
    note: "Looking for bedroom1-IMG_9992-HDR"
  },
  {
    id: 3,
    title: "🍳 Fully-Equipped Stylish Kitchen",
    description: "Cook together in our modern, fully-equipped kitchen. Everything you need for memorable meals and group cooking experiences.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    alt: "Stylish kitchen",
    note: "Looking for kitchen-DSC_8917-HDR"
  },
  {
    id: 4,
    title: "🛋️ Vast Living Room",
    description: "Extra-large couch and sofa-bed perfect for socializing. The heart of your stay where memories are made.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    alt: "Spacious living room",
    note: "Looking for common room-DSC_8961"
  },
  {
    id: 5,
    title: "🚿 Spectacular Bathrooms",
    description: "Two fully-equipped bathrooms with modern fixtures. Never wait in line, even with a full house.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    alt: "Modern bathroom",
    note: "Looking for bathroom downstairs-DSC_8881"
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
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.slice(0, 3).map((feature) => (
              <Card key={feature.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={feature.image}
                  alt={feature.alt}
                  className="w-full h-48 object-cover"
                  data-testid={`feature-image-${feature.id}`}
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-airbnb-dark mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-airbnb-gray">
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
          <div className="grid md:grid-cols-3 gap-8">
            {features.slice(3, 6).map((feature) => (
              <Card key={feature.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <img 
                  src={feature.image}
                  alt={feature.alt}
                  className="w-full h-48 object-cover"
                  data-testid={`feature-image-${feature.id}`}
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-airbnb-dark mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-airbnb-gray">
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
