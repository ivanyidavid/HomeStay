import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from './lib/cors';
import { getExtraGuestFeeForDateRange } from './lib/googleSheets';

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
    
    const extraGuestFee = await getExtraGuestFeeForDateRange(
      startDate as string,
      endDate as string
    );
    
    return res.json({ extraGuestFee });
  } catch (error) {
    console.error('Error fetching extra guest fee:', error);
    return res.status(500).json({ message: 'Failed to fetch extra guest fee' });
  }
}
