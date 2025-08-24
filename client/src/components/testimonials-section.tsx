import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Krisztina",
    date: "February 2025",
    experience: "7 years on Airbnb",
    rating: 5,
    review: "We loved our time spent there. The house was lovely and we had a stunning view from the terrace. Valeriano was also kind and super communicative and shared every important information with us. Highly recommended. :)",
    initial: "K"
  },
  {
    id: 2,
    name: "Kennedy", 
    date: "December 2024",
    experience: "3 years on Airbnb",
    rating: 5,
    review: "Beautiful place with a very lovely host. Vale is very hospitable and helpful.",
    initial: "K"
  },
  {
    id: 3,
    name: "Nikolett",
    date: "July 2024", 
    experience: "6 months on Airbnb",
    rating: 5,
    review: "Beautiful panorama, really quiet and close to nature. We saw a couple of roe deer several times at dawn. We really enjoyed our stay. And the host was infinitely helpful and flexible. Thank you for the opportunity!",
    initial: "N"
  },
  {
    id: 4,
    name: "Vancsura",
    date: "May 2024",
    experience: "3 years on Airbnb", 
    rating: 5,
    review: "Beautiful panoramic accommodation, equipped with all the amenities you need. The host is helpful in everything. We found everything we were looking for here: birds chirping, tranquility, nearby restaurants and real relaxation!",
    initial: "V"
  },
  {
    id: 5,
    name: "Andrea",
    date: "April 2024",
    experience: "9 years on Airbnb",
    rating: 5,
    review: "The accommodation was exactly as shown in the pictures. It was very clean and comfortable, equipped with everything. The view was beautiful. Valeriano was very helpful and kind, communication with him went smoothly.",
    initial: "A"
  },
  {
    id: 6,
    name: "Juraj", 
    date: "January 2025",
    experience: "2 years on Airbnb",
    rating: 5,
    review: "Amazing experience! The location is perfect for a peaceful getaway and the host is incredibly welcoming.",
    initial: "J"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-airbnb-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-airbnb-dark mb-4">
            What Our Guests Say About Us
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="w-6 h-6 fill-yellow-400 text-yellow-400" 
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-airbnb-dark">4.96</span>
            <span className="text-airbnb-gray">from 24 reviews</span>
          </div>
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-50 to-red-50 rounded-full border border-airbnb-red/20">
            <span className="text-sm font-medium text-airbnb-red">🏆 Guest Favourite</span>
            <span className="text-xs text-airbnb-gray ml-2">Top 10% of homes</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id} 
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              data-testid={`testimonial-${testimonial.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-airbnb-red to-pink-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-lg">
                      {testimonial.initial}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-airbnb-dark">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-airbnb-gray">
                      {testimonial.experience}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-4 h-4 fill-yellow-400 text-yellow-400" 
                    />
                  ))}
                  <span className="text-sm text-airbnb-gray ml-2">
                    {testimonial.date}
                  </span>
                </div>
                
                <p className="text-airbnb-gray leading-relaxed">
                  "{testimonial.review}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-airbnb-gray">
            Read all 24 reviews on our Airbnb listing
          </p>
        </div>
      </div>
    </section>
  );
}