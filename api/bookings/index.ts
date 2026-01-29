import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../lib/cors';
import { getBookings, createBooking, getBookingsByDateRange, type InsertBooking } from '../lib/storage';
import { getBlockedDatesForRoom } from '../lib/googleSheets';
import { sendBookingNotification } from '../lib/email';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method === 'GET') {
    try {
      const bookings = getBookings();
      return res.json(bookings);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch bookings' });
    }
  }

  if (req.method === 'POST') {
    try {
      const data = req.body as InsertBooking;
      
      if (!data.checkIn || !data.checkOut || !data.guests || !data.roomType || !data.guestName || !data.guestEmail) {
        return res.status(400).json({ message: 'Missing required booking fields' });
      }
      
      const conflictingBookings = getBookingsByDateRange(data.checkIn, data.checkOut);
      
      const hasConflict = conflictingBookings.some(booking => 
        booking.roomType === data.roomType || 
        booking.roomType === "whole-house" || 
        data.roomType === "whole-house"
      );
      
      if (hasConflict) {
        return res.status(409).json({ 
          message: 'The selected room/dates are not available. Please choose different dates or room type.' 
        });
      }
      
      try {
        const roomTypeMap: { [key: string]: string } = {
          "single-bed": "2x Single Bed Bedroom",
          "double-bed": "Double Bed Bedroom", 
          "bunk-bed": "Bunk Bed Bedroom",
          "whole-house": "Whole House"
        };
        
        const sheetRoomType = roomTypeMap[data.roomType];
        if (sheetRoomType) {
          const blockedDates = await getBlockedDatesForRoom(sheetRoomType);
          
          const checkInDate = new Date(data.checkIn);
          const checkOutDate = new Date(data.checkOut);
          
          const requestedDates = [];
          for (let date = new Date(checkInDate); date < checkOutDate; date.setDate(date.getDate() + 1)) {
            requestedDates.push(date.toISOString().split('T')[0]);
          }
          
          const hasBlockedDate = requestedDates.some(date => blockedDates.includes(date));
          
          if (hasBlockedDate) {
            return res.status(409).json({ 
              message: 'The selected dates are blocked for this room type. Please choose different dates.' 
            });
          }
        }
      } catch (error) {
        console.error('Error checking Google Sheets availability:', error);
      }
      
      const checkInDate = new Date(data.checkIn);
      const checkOutDate = new Date(data.checkOut);
      
      if (checkInDate >= checkOutDate) {
        return res.status(400).json({ 
          message: 'Check-out date must be after check-in date' 
        });
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (checkInDate < today) {
        return res.status(400).json({ 
          message: 'Check-in date must be in the future' 
        });
      }
      
      const booking = createBooking(data);
      
      try {
        await sendBookingNotification(booking);
      } catch (error) {
        console.error('Failed to send booking notification email:', error);
      }
      
      return res.status(201).json(booking);
    } catch (error) {
      console.error('Error creating booking:', error);
      return res.status(500).json({ message: 'Failed to create booking' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
