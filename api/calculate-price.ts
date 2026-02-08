import type { VercelRequest, VercelResponse } from '@vercel/node';
import { googleSheetsService } from '../server/googleSheets';
import { z } from 'zod';

const calculatePriceSchema = z.object({
  checkIn: z.string(),
  checkOut: z.string(),
  roomType: z.enum(["single-bed", "double-bed", "bunk-bed", "whole-house"]),
  guests: z.number().min(1).max(11),
});

export default async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const validatedData = calculatePriceSchema.parse(req.body);
    
    // Room pricing
    const roomPrices: { [key: string]: number } = {
      "single-bed": 80,
      "double-bed": 100,
      "bunk-bed": 90,
      "whole-house": 150
    };

    const nightly = roomPrices[validatedData.roomType];
    
    // Calculate nights
    const checkInDate = new Date(validatedData.checkIn);
    const checkOutDate = new Date(validatedData.checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) {
      res.status(400).json({ message: "Check-out must be after check-in" });
      return;
    }
    
    const roomCost = nights * nightly;
    
    // Get cleaning fees
    const [wholeHouseCleaningFee, roomCleaningFee] = await Promise.all([
      googleSheetsService.getWholeHouseCleaningFee(),
      googleSheetsService.getRoomCleaningFee()
    ]);
    
    const applicableCleaningFee = validatedData.roomType === "whole-house" 
      ? wholeHouseCleaningFee 
      : roomCleaningFee;
    
    // Get extra guest fee
    let extraGuestFee = 0;
    if (validatedData.roomType === "whole-house" && validatedData.guests > 6) {
      const extraGuestFeePerDay = await googleSheetsService.getExtraGuestFeeForDateRange(
        validatedData.checkIn,
        validatedData.checkOut
      );
      const extraGuests = validatedData.guests - 6;
      extraGuestFee = extraGuests * extraGuestFeePerDay;
    }
    
    const subtotal = roomCost + applicableCleaningFee + extraGuestFee;
    const totalPrice = Math.round(subtotal * 100); // Convert to cents
    
    res.status(200).json({
      nightly,
      nights,
      roomCost,
      cleaningFee: applicableCleaningFee,
      extraGuestFee,
      subtotal,
      totalPrice,
      currency: "EUR"
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        message: "Invalid calculation request", 
        errors: error.errors 
      });
    } else {
      console.error("Error calculating price:", error);
      res.status(500).json({ message: "Failed to calculate price" });
    }
  }
};
