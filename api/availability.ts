import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from './lib/cors';
import { getBlockedDatesForAllRooms, getBlockedDatesForRoom } from './lib/googleSheets';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { roomType } = req.query;
    
    if (roomType && typeof roomType === 'string') {
      const blockedDates = await getBlockedDatesForRoom(decodeURIComponent(roomType));
      return res.json({ roomType, blockedDates });
    }
    
    const availability = await getBlockedDatesForAllRooms();
    return res.json(availability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return res.status(500).json({ message: 'Failed to fetch availability from Google Sheets' });
  }
}
