import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from './lib/cors';
import { getBookings, getBooking, createBooking, updateBooking, deleteBooking, getBookingsByDateRange, type InsertBooking } from './lib/storage';
import { getBlockedDatesForRoom } from './lib/googleSheets';
import { sendBookingNotification } from './lib/email';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  const { id, startDate, endDate } = req.query;

  if (req.method === 'GET') {
    try {
      if (id && typeof id === 'string') {
        const booking = getBooking(id);
        if (!booking) {
          return res.status(404).json({ message: 'Booking not found' });
        }
        return res.json(booking);
      }
      
      if (startDate && endDate) {
        const bookings = getBookingsByDateRange(startDate as string, endDate as string);
        return res.json(bookings);
      }
      
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

  if (req.method === 'PATCH') {
    try {
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Booking ID is required' });
      }
      
      const booking = updateBooking(id, req.body);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      return res.json(booking);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update booking' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Booking ID is required' });
      }
      
      const deleted = deleteBooking(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete booking' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
