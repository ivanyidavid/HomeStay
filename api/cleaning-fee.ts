import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from './lib/cors';
import { getWholeHouseCleaningFee, getRoomCleaningFee } from './lib/googleSheets';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const [wholeHouseCleaningFee, roomCleaningFee] = await Promise.all([
      getWholeHouseCleaningFee(),
      getRoomCleaningFee()
    ]);
    
    return res.json({ 
      wholeHouseCleaningFee,
      roomCleaningFee 
    });
  } catch (error) {
    console.error('Error fetching cleaning fees:', error);
    return res.status(500).json({ message: 'Failed to fetch cleaning fees' });
  }
}
