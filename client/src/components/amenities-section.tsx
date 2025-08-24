import { 
  Bath, 
  Bed, 
  Tv, 
  Thermometer, 
  Shield, 
  Wifi, 
  ChefHat, 
  TreePine, 
  Car, 
  Key
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const amenityCategories = [
  {
    title: "Bathroom",
    icon: Bath,
    items: ["Hair dryer", "Hot water"]
  },
  {
    title: "Bedroom & Laundry", 
    icon: Bed,
    items: [
      "Washing machine",
      "Dryer – In unit",
      "Towels, bed sheets, soap and toilet paper",
      "Hangers",
      "Bed linen",
      "Cotton linen", 
      "Extra pillows and blankets",
      "Room-darkening blinds",
      "Iron",
      "Clothes drying rack",
      "Mosquito net",
      "Clothes storage: wardrobe"
    ]
  },
  {
    title: "Entertainment",
    icon: Tv,
    items: ["TV"]
  },
  {
    title: "Heating & Cooling",
    icon: Thermometer,
    items: ["Air conditioning", "Radiant heating"]
  },
  {
    title: "Home Safety",
    icon: Shield,
    items: [
      "Exterior security cameras on property",
      "Security camera monitors the entry area",
      "Smoke alarm",
      "Carbon monoxide alarm", 
      "First aid kit"
    ]
  },
  {
    title: "Internet & Office",
    icon: Wifi,
    items: ["Wifi", "Dedicated workspace"]
  },
  {
    title: "Kitchen & Dining",
    icon: ChefHat,
    items: [
      "Full kitchen for cooking your own meals",
      "Microwave",
      "Cooking basics: pots, pans, oil, salt & pepper",
      "Freezer",
      "Dishwasher", 
      "Electric cooker",
      "Single oven",
      "Kettle",
      "Coffee maker",
      "Wine glasses",
      "Toaster",
      "Dining table"
    ]
  },
  {
    title: "Outdoor",
    icon: TreePine,
    items: ["Shared patio or balcony"]
  },
  {
    title: "Parking",
    icon: Car,
    items: ["Free parking on premises"]
  },
  {
    title: "Services",
    icon: Key,
    items: ["Self check-in", "Lockbox"]
  }
];

export default function AmenitiesSection() {
  return (
    <section className="py-16 bg-airbnb-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-airbnb-dark mb-4">
            Amenities
          </h2>
          <p className="text-lg text-airbnb-gray max-w-3xl mx-auto">
            Everything you need for a comfortable and convenient stay, from modern appliances to safety features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenityCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={index} 
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                data-testid={`amenity-category-${index}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-airbnb-red to-pink-500 rounded-full flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-airbnb-dark">
                      {category.title}
                    </h3>
                  </div>
                  
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li 
                        key={itemIndex} 
                        className="text-airbnb-gray flex items-start"
                      >
                        <span className="w-2 h-2 bg-airbnb-red rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-airbnb-gray">
            All amenities included at no extra charge • Perfect for groups up to 11 guests
          </p>
        </div>
      </div>
    </section>
  );
}