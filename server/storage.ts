import { type User, type InsertUser, type Booking, type InsertBooking } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Booking methods
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: string, booking: Partial<Booking>): Promise<Booking | undefined>;
  deleteBooking(id: string): Promise<boolean>;
  getBookingsByDateRange(startDate: string, endDate: string): Promise<Booking[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bookings: Map<string, Booking>;

  constructor() {
    this.users = new Map();
    this.bookings = new Map();
    
    // Add some mock unavailable dates for demo
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
    
    this.bookings.set(mockBooking1.id, mockBooking1);
    this.bookings.set(mockBooking2.id, mockBooking2);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = {
      ...insertBooking,
      id,
      guestPhone: insertBooking.guestPhone || null,
      status: "pending",
      confirmed: false,
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, ...updates };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  async deleteBooking(id: string): Promise<boolean> {
    return this.bookings.delete(id);
  }

  async getBookingsByDateRange(startDate: string, endDate: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => {
      const bookingStart = new Date(booking.checkIn);
      const bookingEnd = new Date(booking.checkOut);
      const rangeStart = new Date(startDate);
      const rangeEnd = new Date(endDate);
      
      // Check if booking overlaps with the date range
      return bookingStart <= rangeEnd && bookingEnd >= rangeStart;
    });
  }
}

export const storage = new MemStorage();
