import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import { insertBookingSchema } from '../../shared/schema';
import { z } from 'zod';
import { googleSheetsService } from '../../server/googleSheets';
import { emailService } from '../../server/emailService';

export default async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get all bookings
      const bookings = await storage.getBookings();
      res.status(200).json(bookings);
      return;
    }

    if (req.method === 'POST') {
      // Create new booking
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
      
      // Send email notification (don't wait for it to complete)
      emailService.sendBookingNotification(booking).catch((error) => {
        console.error('Failed to send booking notification email:', error);
      });
      
      res.status(201).json(booking);
      return;
    }

    res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        message: "Invalid booking data", 
        errors: error.errors 
      });
    } else {
      console.error('Error in bookings handler:', error);
      res.status(500).json({ message: "Failed to process booking request" });
    }
  }
};
