import { randomUUID } from 'crypto';

export interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string | null;
  totalPrice: number;
  status: string;
  confirmed: boolean;
}

export interface InsertBooking {
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  totalPrice: number;
}

let bookings: Map<string, Booking> = new Map();

const mockBooking1: Booking = {
  id: randomUUID(),
  checkIn: "2024-08-25",
  checkOut: "2024-08-27",
  guests: 4,
  roomType: "double-bed",
  guestName: "Demo Booking",
  guestEmail: "demo@example.com",
  guestPhone: "",
  totalPrice: 30000,
  status: "confirmed",
  confirmed: true,
};

const mockBooking2: Booking = {
  id: randomUUID(),
  checkIn: "2024-09-07",
  checkOut: "2024-09-08",
  guests: 2,
  roomType: "single-bed",
  guestName: "Demo Booking 2",
  guestEmail: "demo2@example.com",
  guestPhone: "",
  totalPrice: 15000,
  status: "confirmed",
  confirmed: true,
};

bookings.set(mockBooking1.id, mockBooking1);
bookings.set(mockBooking2.id, mockBooking2);

export function getBookings(): Booking[] {
  return Array.from(bookings.values());
}

export function getBooking(id: string): Booking | undefined {
  return bookings.get(id);
}

export function createBooking(insertBooking: InsertBooking): Booking {
  const id = randomUUID();
  const booking: Booking = {
    ...insertBooking,
    id,
    guestPhone: insertBooking.guestPhone || null,
    status: "pending",
    confirmed: false,
  };
  bookings.set(id, booking);
  return booking;
}

export function updateBooking(id: string, updates: Partial<Booking>): Booking | undefined {
  const booking = bookings.get(id);
  if (!booking) return undefined;
  
  const updatedBooking = { ...booking, ...updates };
  bookings.set(id, updatedBooking);
  return updatedBooking;
}

export function deleteBooking(id: string): boolean {
  return bookings.delete(id);
}

export function getBookingsByDateRange(startDate: string, endDate: string): Booking[] {
  return Array.from(bookings.values()).filter(booking => {
    const bookingStart = new Date(booking.checkIn);
    const bookingEnd = new Date(booking.checkOut);
    const rangeStart = new Date(startDate);
    const rangeEnd = new Date(endDate);
    
    return bookingStart <= rangeEnd && bookingEnd >= rangeStart;
  });
}
