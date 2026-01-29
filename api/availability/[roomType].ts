import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../lib/cors';
import { getBlockedDatesForRoom } from '../lib/googleSheets';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { roomType } = req.query;
    
    if (!roomType || typeof roomType !== 'string') {
      return res.status(400).json({ message: 'Room type is required' });
    }
    
    const blockedDates = await getBlockedDatesForRoom(decodeURIComponent(roomType));
    return res.json({ roomType: decodeURIComponent(roomType), blockedDates });
  } catch (error) {
    console.error('Error fetching room availability:', error);
    return res.status(500).json({ message: 'Failed to fetch room availability' });
  }
}
