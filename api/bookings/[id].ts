import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';

export default async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    res.status(400).json({ message: "Booking ID is required" });
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get a specific booking
      const booking = await storage.getBooking(id);
      if (!booking) {
        res.status(404).json({ message: "Booking not found" });
        return;
      }
      res.status(200).json(booking);
      return;
    }

    if (req.method === 'PATCH') {
      // Update a booking
      const booking = await storage.updateBooking(id, req.body);
      if (!booking) {
        res.status(404).json({ message: "Booking not found" });
        return;
      }
      res.status(200).json(booking);
      return;
    }

    if (req.method === 'DELETE') {
      // Delete a booking
      const deleted = await storage.deleteBooking(id);
      if (!deleted) {
        res.status(404).json({ message: "Booking not found" });
        return;
      }
      res.status(204).send();
      return;
    }

    res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error('Error in booking handler:', error);
    res.status(500).json({ message: "Failed to process booking request" });
  }
};
