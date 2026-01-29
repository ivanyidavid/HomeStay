import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../lib/cors';
import { getBookingsByDateRange } from '../lib/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const bookings = getBookingsByDateRange(startDate as string, endDate as string);
    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch bookings for date range' });
  }
}
