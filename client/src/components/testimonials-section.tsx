import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// All 24 authentic reviews from Airbnb listing - 4.96/5 rating
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
    review: "🫣",
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
    date: "July 2025", 
    experience: "6 months on Airbnb",
    rating: 5,
    review: "Beautiful panorama, really quiet and close to nature. We saw a couple of roe deer several times at dawn. We really enjoyed our stay. And the host was infinitely helpful and flexible. Thank you for the opportunity!",
    initial: "N",
    avatarColor: "from-purple-500 to-violet-500"
  },
  {
    id: 5,
    name: "Vancsura",
    date: "May 2025",
    experience: "3 years on Airbnb", 
    rating: 5,
    review: "Beautiful panoramic accommodation, equipped with all the amenities you need. The host is helpful in everything. We found everything we were looking for here: birds chirping, tranquility, nearby restaurants and real relaxation!",
    initial: "V",
    avatarColor: "from-orange-500 to-red-500"
  },
  {
    id: 6,
    name: "Andrea",
    date: "April 2025",
    experience: "9 years on Airbnb",
    rating: 5,
    review: "The accommodation was exactly as shown in the pictures. It was very clean and comfortable, equipped with everything. The view was beautiful. Valeriano was very helpful and kind, communication with him went smoothly.",
    initial: "A",
    avatarColor: "from-teal-500 to-cyan-500"
  },
  {
    id: 7,
    name: "Laura",
    date: "July 2025",
    experience: "3 years on Airbnb",
    rating: 5,
    review: "I recommend it from the heart. Beautiful house, beautiful views. I hope we'll be back.",
    initial: "L",
    avatarColor: "from-yellow-500 to-amber-500"
  },
  {
    id: 8,
    name: "Anita",
    date: "June 2025",
    experience: "10 years on Airbnb",
    rating: 5,
    review: "Beautiful views, nice, tidy house and helpful host. Thank you.",
    initial: "A",
    avatarColor: "from-emerald-500 to-green-600"
  },
  {
    id: 9,
    name: "Péter",
    date: "May 2025",
    experience: "3 months on Airbnb",
    rating: 5,
    review: "We were very satisfied with the accommodation and the neighborhood! And Valeriano is very helpful!",
    initial: "P",
    avatarColor: "from-indigo-500 to-purple-500"
  },
  {
    id: 10,
    name: "Anett",
    date: "March 2025",
    experience: "9 years on Airbnb",
    rating: 5,
    review: "We had a great time even though the weather wasn't kind to us. Verőce is a real retreat, for which this accommodation is perfectly suited.",
    initial: "A",
    avatarColor: "from-rose-500 to-pink-600"
  },
  {
    id: 11,
    name: "Annamária",
    date: "March 2025",
    experience: "6 years on Airbnb",
    rating: 5,
    review: "Everything was fine:) Valeriano is kind and very helpful in everything:) The accommodation is exactly as in the pictures, the panorama is beautiful:)",
    initial: "A",
    avatarColor: "from-violet-500 to-indigo-600"
  },
  {
    id: 12,
    name: "Szilvia",
    date: "June 2024",
    experience: "4 years on Airbnb",
    rating: 5,
    review: "Our stay there was amazing! The house, the garden, the view and everything were incomparable. Super nice and flexible host! I highly recommend this place to everbody!",
    initial: "S",
    avatarColor: "from-cyan-500 to-blue-500"
  },
  {
    id: 13,
    name: "Viktor",
    date: "May 2024",
    experience: "9 years on Airbnb",
    rating: 5,
    review: "Valeriano was very helpful and flexible. The place is beautiful and very peaceful. We had no problem during our stay, checking in and out was easy as well.",
    initial: "V",
    avatarColor: "from-lime-500 to-green-500"
  },
  {
    id: 14,
    name: "Hajnalka",
    date: "August 2024",
    experience: "3 years on Airbnb",
    rating: 5,
    review: "Very charming, modern, well equipped and good atmosphere cottage with a beautiful view and luckily air-conditioned. Valeriano and Ildikó were also very kind and helpful. We will definitely go again! :)",
    initial: "H",
    avatarColor: "from-amber-500 to-orange-500"
  },
  {
    id: 15,
    name: "Kwang",
    date: "August 2024",
    experience: "10 years on Airbnb",
    rating: 5,
    review: "It was perfect stay. I wish to visit again.",
    initial: "K",
    avatarColor: "from-red-500 to-rose-500"
  },
  {
    id: 16,
    name: "Dorottya",
    date: "July 2024",
    experience: "10 years on Airbnb",
    rating: 5,
    review: "Amazing place, we had a nice stay with our friend group!",
    initial: "D",
    avatarColor: "from-fuchsia-500 to-pink-500"
  },
  {
    id: 17,
    name: "Anita",
    date: "January 2025",
    experience: "9 years on Airbnb",
    rating: 5,
    review: "We had a great time, comfortable, clean, cozy accommodation, I highly recommend it!",
    initial: "A",
    avatarColor: "from-sky-500 to-cyan-500"
  },
  {
    id: 18,
    name: "Hilmar",
    date: "July 2024",
    experience: "1 year on Airbnb",
    rating: 5,
    review: "A great cottage in a beautiful location and the amenities were great. You just have to pay attention to how you drive to the cottage. Google Maps led us through the forest to the cottage, but that route is not suitable for regular cars.",
    initial: "H",
    avatarColor: "from-emerald-600 to-teal-500"
  },
  {
    id: 19,
    name: "Sára",
    date: "August 2024",
    experience: "8 years on Airbnb",
    rating: 5,
    review: "We had a very nice weekend here with my friends. 20 minutes walk to the beach and the view at the accommodation is amazing. Very good layout, two bathrooms, cleanliness, super comfortable. I hope we have the opportunity to come again next year! Highly recommend! 🌟🌟🌟🌟🌟",
    initial: "S",
    avatarColor: "from-purple-600 to-violet-500"
  },
  {
    id: 20,
    name: "Dániel",
    date: "June 2024",
    experience: "6 years on Airbnb",
    rating: 5,
    review: "Great place to stay with a perfect view. We were with a group of friends. It was perfect!",
    initial: "D",
    avatarColor: "from-orange-600 to-red-500"
  },
  {
    id: 21,
    name: "Arnold György",
    date: "May 2024",
    experience: "6 years on Airbnb",
    rating: 5,
    review: "Everything is as described, very nice view, quiet neighborhood",
    initial: "A",
    avatarColor: "from-slate-500 to-gray-600"
  },
  {
    id: 22,
    name: "Natália",
    date: "August 2024",
    experience: "9 years on Airbnb",
    rating: 5,
    review: "Very nice place to stay!",
    initial: "N",
    avatarColor: "from-pink-600 to-rose-500"
  },
  {
    id: 23,
    name: "Rebeka",
    date: "July 2024",
    experience: "6 years on Airbnb",
    rating: 5,
    review: "The view is beautiful::)",
    initial: "R",
    avatarColor: "from-teal-600 to-cyan-600"
  },
  {
    id: 24,
    name: "Bence",
    date: "July 2024",
    experience: "1 year on Airbnb",
    rating: 4,
    review: "Great location and comfortable stay.",
    initial: "B",
    avatarColor: "from-indigo-600 to-blue-600"
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
            All 24 authentic reviews from our Airbnb listing • 4.96/5 rating
          </p>
        </div>
      </div>
    </section>
  );
}