import { Wifi, Briefcase, Snowflake, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const specialFeatures = [
  {
    id: 1,
    title: "Flexible Booking Options",
    description: "Possible to book only 1 room for smaller groups or individual stays",
    icon: Home,
    iconColor: "from-blue-500 to-indigo-500"
  },
  {
    id: 2,
    title: "High-Speed Wifi",
    description: "Reliable, fast internet connection for work, streaming, and staying connected",
    icon: Wifi,
    iconColor: "from-green-500 to-emerald-500"
  },
  {
    id: 3,
    title: "Dedicated Workspace",
    description: "Professional workspace perfect for remote work, meetings, and productivity",
    icon: Briefcase,
    iconColor: "from-purple-500 to-violet-500"
  },
  {
    id: 4,
    title: "Air Conditioning",
    description: "Climate-controlled comfort throughout your stay, perfect for any weather",
    icon: Snowflake,
    iconColor: "from-cyan-500 to-blue-500"
  }
];

export default function WhatMakesUsSpecialSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-airbnb-dark mb-4">
            What Makes Us Special
          </h2>
          <p className="text-lg text-airbnb-gray max-w-3xl mx-auto">
            Key features that set our guest house apart and make your stay exceptional.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={feature.id} 
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 text-center"
                data-testid={`special-feature-${feature.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.iconColor} rounded-full flex items-center justify-center`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-airbnb-dark mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm text-airbnb-gray leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}