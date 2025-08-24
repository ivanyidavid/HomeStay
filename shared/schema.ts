import { sql } from "drizzle-orm";
import { pgTable, text, varchar, date, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),
  guests: integer("guests").notNull(),
  roomType: text("room_type").notNull(), // single-bed, double-bed, bunk-bed, whole-house
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone"),
  totalPrice: integer("total_price").notNull(), // in cents
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
  confirmed: boolean("confirmed").notNull().default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  status: true,
  confirmed: true,
}).extend({
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().min(1).max(11),
  roomType: z.enum(["single-bed", "double-bed", "bunk-bed", "whole-house"]),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  totalPrice: z.number().min(0),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
