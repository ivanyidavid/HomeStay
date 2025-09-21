import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format, addDays, isAfter, isBefore, parseISO } from "date-fns";
import type { Booking } from "@shared/schema";

// Import optimized image component
import OptimizedImage from "@/components/OptimizedImage";
import type { ImageKey } from "@/lib/imageMap";

const roomOptions = [
  {
    id: "single-bed",
    name: "2x Single Bed Bedroom",
    description: "Comfortable room with two single beds",
    maxGuests: 2,
    pricePerNight: 80,
    imageKey: "bedroom2-DSC_8860-HDR" as ImageKey,
    features: ["2 Single Beds", "Shared Bathroom", "Mountain Views"]
  },
  {
    id: "double-bed",
    name: "Double Bed Bedroom",
    description: "Cozy room with a comfortable double bed",
    maxGuests: 2,
    pricePerNight: 100,
    imageKey: "bedroom1-IMG_9992-HDR" as ImageKey,
    features: ["1 Double Bed", "Private Bathroom", "Hill Views"]
  },
  {
    id: "bunk-bed",
    name: "Bunk Bed Bedroom",
    description: "Fun room with bunk beds, perfect for families",
    maxGuests: 4,
    pricePerNight: 90,
    imageKey: "bunk bedroom-DSC_8843" as ImageKey,
    features: ["1 Bunk Bed", "Shared Bathroom", "Family Friendly"]
  },
  {
    id: "whole-house",
    name: "Whole House",
    description: "Entire guest house with all bedrooms and amenities",
    maxGuests: 11,
    pricePerNight: 150,
    imageKey: "common room-IMG_0083-HDR" as ImageKey,
    features: ["All 3 Bedrooms", "2 Bathrooms", "Full Kitchen", "Living Room", "Terrace"]
  }
];

export default function BookingSection() {
  const [selectedRoom, setSelectedRoom] = useState<string>("whole-house");
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const { toast } = useToast();
  
  const currentRoom = roomOptions.find(room => room.id === selectedRoom) || roomOptions[3];

  // Fetch existing bookings to show unavailable dates
  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });
  
  // Fetch Google Sheets availability data
  const { data: sheetsAvailability = {} } = useQuery<{ [key: string]: string[] }>({
    queryKey: ["/api/availability"],
    refetchInterval: 1 * 60 * 1000, // Refetch every 1 minute
  });

  // Fetch cleaning fees from Google Sheets cells N2 and O2
  const { data: cleaningFeeData } = useQuery<{ wholeHouseCleaningFee: number; roomCleaningFee: number }>({
    queryKey: ["/api/cleaning-fee"],
    refetchInterval: 1 * 60 * 1000, // Refetch every 1 minute to stay in sync with sheets
  });

  const wholeHouseCleaningFee = cleaningFeeData?.wholeHouseCleaningFee || 0;
  const roomCleaningFee = cleaningFeeData?.roomCleaningFee || 0;

  // Fetch extra guest fee for specific date range (only when dates are selected)
  const { data: extraGuestFeeData } = useQuery<{ extraGuestFee: number }>({
    queryKey: ["/api/extra-guest-fee", checkInDate ? format(checkInDate, "yyyy-MM-dd") : null, checkOutDate ? format(checkOutDate, "yyyy-MM-dd") : null],
    queryFn: async () => {
      if (!checkInDate || !checkOutDate) return { extraGuestFee: 0 };
      const startDate = format(checkInDate, "yyyy-MM-dd");
      const endDate = format(checkOutDate, "yyyy-MM-dd");
      const response = await fetch(`/api/extra-guest-fee?startDate=${startDate}&endDate=${endDate}`);
      return response.json();
    },
    enabled: !!(checkInDate && checkOutDate), // Only fetch when both dates are selected
  });

  const extraGuestFeePerDay = extraGuestFeeData?.extraGuestFee || 0;

  // Get unavailable dates from existing bookings for selected room type
  const bookingUnavailableDates = bookings
    .filter(booking => booking.roomType === selectedRoom || booking.roomType === "whole-house" || selectedRoom === "whole-house")
    .flatMap((booking) => {
      const start = parseISO(booking.checkIn);
      const end = parseISO(booking.checkOut);
      const dates = [];
      
      for (let date = new Date(start); date < end; date = addDays(date, 1)) {
        dates.push(new Date(date));
      }
      
      return dates;
    });
    
  // Get blocked dates from Google Sheets for selected room type
  const roomTypeMap: { [key: string]: string } = {
    "single-bed": "2x Single Bed Bedroom",
    "double-bed": "Double Bed Bedroom", 
    "bunk-bed": "Bunk Bed Bedroom",
    "whole-house": "Whole House"
  };
  
  const currentRoomSheetName = roomTypeMap[selectedRoom];
  const sheetsBlockedDates = currentRoomSheetName && sheetsAvailability[currentRoomSheetName] 
    ? sheetsAvailability[currentRoomSheetName].map(dateStr => new Date(dateStr))
    : [];
    
  // Also check if "Whole House" is blocked when booking individual rooms
  const wholeHouseBlockedDates = selectedRoom !== "whole-house" && sheetsAvailability["Whole House"]
    ? sheetsAvailability["Whole House"].map(dateStr => new Date(dateStr))
    : [];
    
  // Combine all unavailable dates
  const unavailableDates = [...bookingUnavailableDates, ...sheetsBlockedDates, ...wholeHouseBlockedDates];

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Created",
        description: "Your booking request has been submitted successfully!",
      });
      // Reset form
      setCheckInDate(undefined);
      setCheckOutDate(undefined);
      setGuests(1);
      setSelectedRoom("whole-house");
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
      // Invalidate bookings cache
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkInDate || !checkOutDate) {
      toast({
        title: "Missing Dates",
        description: "Please select both check-in and check-out dates.",
        variant: "destructive",
      });
      return;
    }
    
    if (!guestName || !guestEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email address.",
        variant: "destructive",
      });
      return;
    }

    if (guests > currentRoom.maxGuests) {
      toast({
        title: "Too Many Guests",
        description: `This room can accommodate up to ${currentRoom.maxGuests} guests. Please select a different room or reduce guest count.`,
        variant: "destructive",
      });
      return;
    }

    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const roomCost = nights * currentRoom.pricePerNight;
    const applicableCleaningFee = selectedRoom === "whole-house" ? wholeHouseCleaningFee : roomCleaningFee;
    
    // Calculate extra guest fee (only for whole house bookings with more than 6 guests)
    const extraGuests = selectedRoom === "whole-house" && guests > 6 ? guests - 6 : 0;
    const extraGuestFee = extraGuests * extraGuestFeePerDay;
    
    const totalPrice = (roomCost + applicableCleaningFee + extraGuestFee) * 100; // Convert to cents

    createBookingMutation.mutate({
      checkIn: format(checkInDate, "yyyy-MM-dd"),
      checkOut: format(checkOutDate, "yyyy-MM-dd"),
      guests,
      roomType: selectedRoom,
      guestName,
      guestEmail,
      guestPhone: guestPhone || "",
      totalPrice,
    });
  };

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isBefore(date, today)) return true;
    
    // Disable unavailable dates
    return unavailableDates.some(unavailableDate => 
      unavailableDate.toDateString() === date.toDateString()
    );
  };

  const nights = checkInDate && checkOutDate 
    ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  const roomCost = nights * currentRoom.pricePerNight;
  const applicableWholeHouseCleaningFee = selectedRoom === "whole-house" ? wholeHouseCleaningFee : 0;
  const applicableRoomCleaningFee = selectedRoom !== "whole-house" ? roomCleaningFee : 0;
  
  // Calculate extra guest fee for display (only for whole house bookings with more than 6 guests)
  const extraGuests = selectedRoom === "whole-house" && guests > 6 ? guests - 6 : 0;
  const extraGuestFee = extraGuests * extraGuestFeePerDay;
  
  const totalPrice = roomCost + applicableWholeHouseCleaningFee + applicableRoomCleaningFee + extraGuestFee;

  return (
    <section id="booking" className="py-16 bg-airbnb-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white rounded-2xl shadow-xl">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-airbnb-dark text-center mb-8">
              Book Your Stay
            </h2>
            
            <form onSubmit={handleSubmit}>
              {/* Room Selection */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-airbnb-dark mb-4">
                  Choose Your Room
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {roomOptions.map((room) => (
                    <div 
                      key={room.id}
                      className={`relative cursor-pointer rounded-xl border-2 transition-all ${
                        selectedRoom === room.id 
                          ? 'border-airbnb-red bg-red-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedRoom(room.id);
                        if (guests > room.maxGuests) {
                          setGuests(room.maxGuests);
                        }
                      }}
                      data-testid={`room-option-${room.id}`}
                    >
                      <div className="p-4">
                        <OptimizedImage
                          imageKey={room.imageKey}
                          alt={room.name}
                          className="w-full h-32 rounded-lg mb-3"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          objectFit="cover"
                          priority={room.id === "whole-house"}
                        />
                        <h4 className="font-semibold text-sm text-airbnb-dark mb-1">
                          {room.name}
                        </h4>
                        <p className="text-xs text-airbnb-gray mb-2">
                          {room.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {room.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-airbnb-gray">
                            Up to {room.maxGuests} guests
                          </span>
                          <span className="font-semibold text-airbnb-dark">
                            €{room.pricePerNight}/night
                          </span>
                        </div>
                      </div>
                      {selectedRoom === room.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-airbnb-red rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Booking Form */}
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="guest-name" className="block text-sm font-medium text-airbnb-dark mb-2">
                      Full Name *
                    </Label>
                    <Input
                      id="guest-name"
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full"
                      data-testid="input-guest-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="guest-email" className="block text-sm font-medium text-airbnb-dark mb-2">
                      Email Address *
                    </Label>
                    <Input
                      id="guest-email"
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full"
                      data-testid="input-guest-email"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="guest-phone" className="block text-sm font-medium text-airbnb-dark mb-2">
                      Phone Number
                    </Label>
                    <Input
                      id="guest-phone"
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full"
                      data-testid="input-guest-phone"
                    />
                  </div>
                  
                  <div>
                    <Label className="block text-sm font-medium text-airbnb-dark mb-2">
                      Number of Guests
                    </Label>
                    <Select value={guests.toString()} onValueChange={(value) => setGuests(parseInt(value))}>
                      <SelectTrigger className="w-full" data-testid="select-guests">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: currentRoom.maxGuests }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} guest{num > 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {guests > currentRoom.maxGuests && (
                      <p className="text-sm text-red-600 mt-1">
                        Selected room accommodates up to {currentRoom.maxGuests} guests
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-airbnb-red hover:bg-red-600 text-white font-semibold py-4"
                    disabled={createBookingMutation.isPending}
                    data-testid="button-submit-booking"
                  >
                    {createBookingMutation.isPending ? "Processing..." : "Book Now"}
                  </Button>
                </div>
                
                {/* Booking Summary */}
                <div className="bg-airbnb-light rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-airbnb-dark mb-4">
                    Booking Summary
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-airbnb-gray">Room Type:</span>
                      <span className="text-airbnb-dark font-medium">{currentRoom.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-airbnb-gray">Max Capacity:</span>
                      <span className="text-airbnb-dark font-medium">Up to {currentRoom.maxGuests} guests</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-airbnb-gray">Rate:</span>
                      <span className="text-airbnb-dark font-medium">€{currentRoom.pricePerNight}/night</span>
                    </div>
                    
                    {checkInDate && checkOutDate && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-airbnb-gray">Check-in:</span>
                          <span className="text-airbnb-dark font-medium">
                            {format(checkInDate, "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-airbnb-gray">Check-out:</span>
                          <span className="text-airbnb-dark font-medium">
                            {format(checkOutDate, "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-airbnb-gray">Nights:</span>
                          <span className="text-airbnb-dark font-medium">{nights}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-airbnb-gray">Rate:</span>
                          <span className="text-airbnb-dark font-medium">€{currentRoom.pricePerNight} × {nights}</span>
                        </div>
                        {selectedRoom === "whole-house" && applicableWholeHouseCleaningFee > 0 && (
                          <div className="flex justify-between">
                            <span className="text-airbnb-gray">Whole house cleaning fee:</span>
                            <span className="text-airbnb-dark font-medium">€{applicableWholeHouseCleaningFee}</span>
                          </div>
                        )}
                        {selectedRoom !== "whole-house" && applicableRoomCleaningFee > 0 && (
                          <div className="flex justify-between">
                            <span className="text-airbnb-gray">Room cleaning fee:</span>
                            <span className="text-airbnb-dark font-medium">€{applicableRoomCleaningFee}</span>
                          </div>
                        )}
                        {selectedRoom === "whole-house" && extraGuests > 0 && extraGuestFee > 0 && (
                          <div className="flex justify-between">
                            <span className="text-airbnb-gray">Extra fee/guest above 6 guests:</span>
                            <span className="text-airbnb-dark font-medium">€{extraGuestFeePerDay} × {extraGuests} = €{extraGuestFee}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between font-semibold text-airbnb-dark">
                      <span>Total:</span>
                      <span data-testid="booking-total">€{totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Calendar Display */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-airbnb-dark mb-4">
                  Select Your Dates
                </h3>
                <div className="bg-airbnb-light rounded-xl p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="block text-sm font-medium text-airbnb-dark mb-2">
                        Check-in Date
                      </Label>
                      <Calendar
                        mode="single"
                        selected={checkInDate}
                        onSelect={setCheckInDate}
                        disabled={isDateDisabled}
                        className="rounded-md border"
                        data-testid="calendar-checkin"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-airbnb-dark mb-2">
                        Check-out Date
                      </Label>
                      <Calendar
                        mode="single"
                        selected={checkOutDate}
                        onSelect={setCheckOutDate}
                        disabled={(date) => {
                          if (!checkInDate) return isDateDisabled(date);
                          return isDateDisabled(date) || !isAfter(date, checkInDate);
                        }}
                        className="rounded-md border"
                        data-testid="calendar-checkout"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-airbnb-red rounded mr-2"></div>
                      <span className="text-airbnb-gray">Selected</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                      <span className="text-airbnb-gray">Unavailable</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
