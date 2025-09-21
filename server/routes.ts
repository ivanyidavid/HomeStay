import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import { z } from "zod";
import { googleSheetsService } from "./googleSheets";
import { emailService } from "./emailService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all bookings
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Get bookings by date range
  app.get("/api/bookings/range", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        res.status(400).json({ message: "Start date and end date are required" });
        return;
      }
      
      const bookings = await storage.getBookingsByDateRange(
        startDate as string,
        endDate as string
      );
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings for date range" });
    }
  });

  // Get availability from Google Sheets
  app.get("/api/availability", async (req, res) => {
    try {
      const availability = await googleSheetsService.getBlockedDatesForAllRooms();
      res.json(availability);
    } catch (error) {
      console.error('Error fetching availability:', error);
      res.status(500).json({ message: "Failed to fetch availability from Google Sheets" });
    }
  });

  // Get cleaning fees from Google Sheets cells N2 and O2
  app.get("/api/cleaning-fee", async (req, res) => {
    try {
      const [wholeHouseCleaningFee, roomCleaningFee] = await Promise.all([
        googleSheetsService.getWholeHouseCleaningFee(),
        googleSheetsService.getRoomCleaningFee()
      ]);
      res.json({ 
        wholeHouseCleaningFee,
        roomCleaningFee 
      });
    } catch (error) {
      console.error("Error fetching cleaning fees:", error);
      res.status(500).json({ message: "Failed to fetch cleaning fees" });
    }
  });

  // Get availability for specific room type
  app.get("/api/availability/:roomType", async (req, res) => {
    try {
      const { roomType } = req.params;
      const blockedDates = await googleSheetsService.getBlockedDatesForRoom(decodeURIComponent(roomType));
      res.json({ roomType, blockedDates });
    } catch (error) {
      console.error('Error fetching room availability:', error);
      res.status(500).json({ message: "Failed to fetch room availability" });
    }
  });

  // Create a new booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      
      // Check for date conflicts based on room type
      const conflictingBookings = await storage.getBookingsByDateRange(
        validatedData.checkIn,
        validatedData.checkOut
      );
      
      // Check if there are conflicts for the specific room type or whole house bookings
      const hasConflict = conflictingBookings.some(booking => 
        booking.roomType === validatedData.roomType || 
        booking.roomType === "whole-house" || 
        validatedData.roomType === "whole-house"
      );
      
      if (hasConflict) {
        res.status(409).json({ 
          message: "The selected room/dates are not available. Please choose different dates or room type." 
        });
        return;
      }
      
      // Check Google Sheets for blocked dates
      try {
        const roomTypeMap: { [key: string]: string } = {
          "single-bed": "2x Single Bed Bedroom",
          "double-bed": "Double Bed Bedroom", 
          "bunk-bed": "Bunk Bed Bedroom",
          "whole-house": "Whole House"
        };
        
        const sheetRoomType = roomTypeMap[validatedData.roomType];
        if (sheetRoomType) {
          const blockedDates = await googleSheetsService.getBlockedDatesForRoom(sheetRoomType);
          
          // Check if any requested dates are blocked
          const checkInDate = new Date(validatedData.checkIn);
          const checkOutDate = new Date(validatedData.checkOut);
          
          const requestedDates = [];
          for (let date = new Date(checkInDate); date < checkOutDate; date.setDate(date.getDate() + 1)) {
            requestedDates.push(date.toISOString().split('T')[0]);
          }
          
          const hasBlockedDate = requestedDates.some(date => blockedDates.includes(date));
          
          if (hasBlockedDate) {
            res.status(409).json({ 
              message: "The selected dates are blocked for this room type. Please choose different dates." 
            });
            return;
          }
        }
      } catch (error) {
        console.error('Error checking Google Sheets availability:', error);
        // Continue with booking if Google Sheets check fails
      }
      
      // Validate check-in is before check-out
      const checkInDate = new Date(validatedData.checkIn);
      const checkOutDate = new Date(validatedData.checkOut);
      
      if (checkInDate >= checkOutDate) {
        res.status(400).json({ 
          message: "Check-out date must be after check-in date" 
        });
        return;
      }
      
      // Validate dates are in the future
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (checkInDate < today) {
        res.status(400).json({ 
          message: "Check-in date must be in the future" 
        });
        return;
      }
      
      const booking = await storage.createBooking(validatedData);
      
      // Send email notification
      try {
        await emailService.sendBookingNotification(booking);
      } catch (error) {
        console.error('Failed to send booking notification email:', error);
        // Don't fail the booking if email fails
      }
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid booking data", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Failed to create booking" });
      }
    }
  });

  // Get a specific booking
  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        res.status(404).json({ message: "Booking not found" });
        return;
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  // Update a booking
  app.patch("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.updateBooking(req.params.id, req.body);
      if (!booking) {
        res.status(404).json({ message: "Booking not found" });
        return;
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking" });
    }
  });

  // Delete a booking
  app.delete("/api/bookings/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteBooking(req.params.id);
      if (!deleted) {
        res.status(404).json({ message: "Booking not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete booking" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
