import type { VercelRequest, VercelResponse } from '@vercel/node';
import { googleSheetsService } from '@/server/googleSheets';

export default async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const availability = await googleSheetsService.getBlockedDatesForAllRooms();
    res.status(200).json(availability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ message: "Failed to fetch availability from Google Sheets" });
  }
};
