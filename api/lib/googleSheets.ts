import { google } from 'googleapis';

const SHEET_ID = '1xKU0YZdoOWrhEKOeBVPVLO-U9IYzTE6m6pKuOTc6-ZM';
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY || 'AIzaSyBcU26MCdKJAUYG1t-Zpb_ifUk0wyYYeQ4';

interface SheetAvailability {
  date: string;
  roomType: string;
  blocked: boolean;
}

function getSheets() {
  return google.sheets({
    version: 'v4',
    auth: API_KEY
  });
}

export async function getAvailabilityData(): Promise<SheetAvailability[]> {
  try {
    const sheets = getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'A:Z',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found in sheet');
      return [];
    }

    const availability: SheetAvailability[] = [];
    const headerRow = rows[0];
    
    const roomColumns: { [key: string]: number } = {};
    const roomTypes = ['2x Single Bed Bedroom', 'Double Bed Bedroom', 'Bunk Bed Bedroom', 'Whole House'];
    
    headerRow.forEach((header: string, index: number) => {
      if (roomTypes.includes(header.trim())) {
        roomColumns[header.trim()] = index;
      }
    });

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const dateValue = row[0];
      
      if (!dateValue) continue;
      
      let formattedDate: string;
      try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) {
          const parts = dateValue.split('/');
          if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1;
            const year = parseInt(parts[2]);
            const parsedDate = new Date(year, month, day);
            formattedDate = parsedDate.toISOString().split('T')[0];
          } else {
            continue;
          }
        } else {
          formattedDate = date.toISOString().split('T')[0];
        }
      } catch (error) {
        continue;
      }

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

export async function getBlockedDatesForRoom(roomType: string): Promise<string[]> {
  const availability = await getAvailabilityData();
  return availability
    .filter(item => item.roomType === roomType && item.blocked)
    .map(item => item.date);
}

export async function getBlockedDatesForAllRooms(): Promise<{ [roomType: string]: string[] }> {
  const availability = await getAvailabilityData();
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

export async function getWholeHouseCleaningFee(): Promise<number> {
  try {
    const sheets = getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'N2',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0 || !rows[0] || !rows[0][0]) {
      return 0;
    }

    const feeValue = rows[0][0];
    const fee = parseFloat(feeValue.toString().replace(/[^\d.-]/g, ''));
    
    if (isNaN(fee)) {
      return 0;
    }

    console.log(`Loaded whole house cleaning fee: €${fee}`);
    return fee;
  } catch (error) {
    console.error('Error reading cleaning fee from Google Sheets:', error);
    return 0;
  }
}

export async function getRoomCleaningFee(): Promise<number> {
  try {
    const sheets = getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'O2',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0 || !rows[0] || !rows[0][0]) {
      return 0;
    }

    const feeValue = rows[0][0];
    const fee = parseFloat(feeValue.toString().replace(/[^\d.-]/g, ''));
    
    if (isNaN(fee)) {
      return 0;
    }

    console.log(`Loaded room cleaning fee: €${fee}`);
    return fee;
  } catch (error) {
    console.error('Error reading room cleaning fee from Google Sheets:', error);
    return 0;
  }
}

export async function getExtraGuestFeeForDateRange(startDate: string, endDate: string): Promise<number> {
  try {
    const sheets = getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'A:M',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return 0;
    }

    const headerRow = rows[0];
    let dateColumnIndex = 0;
    let extraGuestFeeColumnIndex = -1;

    headerRow.forEach((header: string, index: number) => {
      if (index === 12) {
        extraGuestFeeColumnIndex = index;
      }
    });

    if (extraGuestFeeColumnIndex === -1) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    let totalExtraGuestFee = 0;
    let daysCount = 0;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const dateValue = row[dateColumnIndex];
      
      if (!dateValue) continue;

      let formattedDate: string;
      try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) {
          const parts = dateValue.split('/');
          if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1;
            const year = parseInt(parts[2]);
            const parsedDate = new Date(year, month, day);
            formattedDate = parsedDate.toISOString().split('T')[0];
          } else {
            continue;
          }
        } else {
          formattedDate = date.toISOString().split('T')[0];
        }
      } catch (error) {
        continue;
      }

      const currentDate = new Date(formattedDate);
      if (currentDate >= start && currentDate < end) {
        const extraGuestFeeValue = row[extraGuestFeeColumnIndex];
        if (extraGuestFeeValue) {
          const fee = parseFloat(extraGuestFeeValue.toString().replace(/[^\d.-]/g, ''));
          if (!isNaN(fee)) {
            totalExtraGuestFee += fee;
            daysCount++;
          }
        }
      }
    }

    const averageExtraGuestFee = daysCount > 0 ? totalExtraGuestFee / daysCount : 0;
    
    console.log(`Loaded extra guest fee for date range ${startDate} to ${endDate}: €${averageExtraGuestFee} per day (${daysCount} days)`);
    return averageExtraGuestFee;
  } catch (error) {
    console.error('Error reading extra guest fees from Google Sheets:', error);
    return 0;
  }
}
