import { google } from 'googleapis';

const SHEET_ID = '1xKU0YZdoOWrhEKOeBVPVLO-U9IYzTE6m6pKuOTc6-ZM';
const API_KEY = 'AIzaSyBcU26MCdKJAUYG1t-Zpb_ifUk0wyYYeQ4';

interface SheetAvailability {
  date: string;
  roomType: string;
  blocked: boolean;
}

export class GoogleSheetsService {
  private sheets;

  constructor() {
    this.sheets = google.sheets({
      version: 'v4',
      auth: API_KEY
    });
  }

  async getAvailabilityData(): Promise<SheetAvailability[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'A:Z', // Get all data
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        console.log('No data found in sheet');
        return [];
      }

      const availability: SheetAvailability[] = [];
      const headerRow = rows[0];
      
      // Find room type columns (skip first column which should be dates)
      const roomColumns: { [key: string]: number } = {};
      const roomTypes = ['2x Single Bed Bedroom', 'Double Bed Bedroom', 'Bunk Bed Bedroom', 'Whole House'];
      
      headerRow.forEach((header: string, index: number) => {
        if (roomTypes.includes(header.trim())) {
          roomColumns[header.trim()] = index;
        }
      });

      // Process each data row (skip header)
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const dateValue = row[0];
        
        if (!dateValue) continue;
        
        // Parse date - assuming format is YYYY-MM-DD or convertible
        let formattedDate: string;
        try {
          // Try to parse various date formats
          const date = new Date(dateValue);
          if (isNaN(date.getTime())) {
            // Try parsing DD/MM/YYYY format
            const parts = dateValue.split('/');
            if (parts.length === 3) {
              const day = parseInt(parts[0]);
              const month = parseInt(parts[1]) - 1; // Month is 0-indexed
              const year = parseInt(parts[2]);
              const parsedDate = new Date(year, month, day);
              formattedDate = parsedDate.toISOString().split('T')[0];
            } else {
              continue; // Skip invalid dates
            }
          } else {
            formattedDate = date.toISOString().split('T')[0];
          }
        } catch (error) {
          console.log(`Skipping invalid date: ${dateValue}`);
          continue;
        }

        // Check each room type column for 'x' values
        Object.entries(roomColumns).forEach(([roomType, columnIndex]) => {
          const cellValue = row[columnIndex];
          const isBlocked = cellValue && cellValue.toString().toLowerCase().trim() === 'x';
          
          if (isBlocked) {
            availability.push({
              date: formattedDate,
              roomType: roomType,
              blocked: true
            });
          }
        });
      }

      console.log(`Loaded ${availability.length} blocked dates from Google Sheets`);
      return availability;
    } catch (error) {
      console.error('Error reading Google Sheets:', error);
      return [];
    }
  }

  async getBlockedDatesForRoom(roomType: string): Promise<string[]> {
    const availability = await this.getAvailabilityData();
    return availability
      .filter(item => item.roomType === roomType && item.blocked)
      .map(item => item.date);
  }

  async getBlockedDatesForAllRooms(): Promise<{ [roomType: string]: string[] }> {
    const availability = await this.getAvailabilityData();
    const blocked: { [roomType: string]: string[] } = {
      '2x Single Bed Bedroom': [],
      'Double Bed Bedroom': [],
      'Bunk Bed Bedroom': [],
      'Whole House': []
    };

    availability.forEach(item => {
      if (item.blocked && blocked[item.roomType]) {
        blocked[item.roomType].push(item.date);
      }
    });

    return blocked;
  }
}

export const googleSheetsService = new GoogleSheetsService();