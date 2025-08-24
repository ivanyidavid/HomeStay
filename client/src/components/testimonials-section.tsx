import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Authentic reviews extracted from Airbnb listing - 4.96/5 rating from 24 reviews
// Note: Only showing the reviews visible on the main page as Airbnb limits display
const testimonials = [
  {
    id: 1,
    name: "Krisztina",
    date: "February 2025",
    experience: "7 years on Airbnb",
    rating: 5,
    review: "We loved our time spent there. The house was lovely and we had a stunning view from the terrace. Valeriano was also kind and super communicative and shared every important information with us. Highly recommended. :)",
    initial: "K",
    avatarColor: "from-pink-500 to-rose-500"
  },
  {
    id: 2,
    name: "Juraj",
    date: "2 weeks ago", 
    experience: "2 years on Airbnb",
    rating: 5,
    review: "🫣", // This was the actual review content shown on Airbnb
    initial: "J",
    avatarColor: "from-blue-500 to-indigo-500"
  },
  {
    id: 3,
    name: "Kennedy", 
    date: "December 2024",
    experience: "3 years on Airbnb",
    rating: 5,
    review: "Beautiful place with a very lovely host. Vale is very hospitable and helpful.",
    initial: "K",
    avatarColor: "from-green-500 to-emerald-500"
  },
  {
    id: 4,
    name: "Nikolett",
    date: "July 2024", 
    experience: "6 months on Airbnb",
    rating: 5,
    review: "Beautiful panorama, really quiet and close to nature. We saw a couple of roe deer several times at dawn. We really enjoyed our stay. And the host was infinitely helpful and flexible. Thank you for the opportunity!",
    initial: "N",
    avatarColor: "from-purple-500 to-violet-500"
  },
  {
    id: 5,
    name: "Vancsura",
    date: "May 2024",
    experience: "3 years on Airbnb", 
    rating: 5,
    review: "Beautiful panoramic accommodation, equipped with all the amenities you need. The host is helpful in everything. We found everything we were looking for here: birds chirping, tranquility, nearby restaurants and real relaxation!",
    initial: "V",
    avatarColor: "from-orange-500 to-red-500"
  },
  {
    id: 6,
    name: "Andrea",
    date: "April 2024",
    experience: "9 years on Airbnb",
    rating: 5,
    review: "The accommodation was exactly as shown in the pictures. It was very clean and comfortable, equipped with everything. The view was beautiful. Valeriano was very helpful and kind, communication with him went smoothly.",
    initial: "A",
    avatarColor: "from-teal-500 to-cyan-500"
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

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card 
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 h-full"
                  data-testid={`testimonial-${testimonial.id}`}
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${testimonial.avatarColor} rounded-full flex items-center justify-center mr-4 shadow-lg`}>
                        <span className="text-white font-bold text-xl">
                          {testimonial.initial}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-airbnb-dark text-lg">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-airbnb-gray">
                          {testimonial.experience}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-5 h-5 fill-yellow-400 text-yellow-400" 
                        />
                      ))}
                      <span className="text-sm text-airbnb-gray ml-2">
                        {testimonial.date}
                      </span>
                    </div>
                    
                    <p className="text-airbnb-gray leading-relaxed flex-grow">
                      "{testimonial.review}"
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-12" />
          <CarouselNext className="-right-12" />
        </Carousel>

        <div className="text-center mt-10">
          <p className="text-airbnb-gray">
            Showing authentic reviews from our Airbnb listing • 24 total reviews (4.96/5 rating)
          </p>
        </div>
      </div>
    </section>
  );
}