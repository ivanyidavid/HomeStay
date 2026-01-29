import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../lib/cors';
import { getBooking, updateBooking, deleteBooking } from '../lib/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Booking ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const booking = getBooking(id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      return res.json(booking);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch booking' });
    }
  }

  if (req.method === 'PATCH') {
    try {
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
