import nodemailer from 'nodemailer';
import type { Booking } from '@shared/schema';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.setupTransporter();
  }

  private setupTransporter() {
    // Check if email credentials are provided
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const emailPort = parseInt(process.env.EMAIL_PORT || '587');

    if (!emailUser || !emailPass) {
      console.log('Email credentials not provided. Email notifications disabled.');
      return;
        if (!emailUser) {
          console.warn('EMAIL_USER environment variable not set. Email notifications will be disabled.');
          return;
        }
        if (!emailPass) {
          console.warn('EMAIL_PASS environment variable not set. Email notifications will be disabled.');
          return;
        }
    }

    const config: EmailConfig = {
      host: emailHost,
      port: emailPort,
      secure: emailPort === 465,
      auth: {
        user: emailUser,
        pass: emailPass
      }
    };

    this.transporter = nodemailer.createTransport(config);
  }

  async sendBookingNotification(booking: Booking): Promise<boolean> {
    if (!this.transporter) {
      console.log('Email transporter not configured. Skipping email notification.');
      return false;
    }

    try {
      const roomTypeMap: { [key: string]: string } = {
        "single-bed": "2x Single Bed Bedroom",
        "double-bed": "Double Bed Bedroom", 
        "bunk-bed": "Bunk Bed Bedroom",
        "whole-house": "Whole House"
      };

      const roomName = roomTypeMap[booking.roomType] || booking.roomType;
      const checkInDate = new Date(booking.checkIn).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const checkOutDate = new Date(booking.checkOut).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const nights = Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = nights * (booking.roomType === 'single-bed' ? 80 : 
                                  booking.roomType === 'double-bed' ? 100 :
                                  booking.roomType === 'bunk-bed' ? 90 : 150);

      const emailContent = `
🏠 New Booking Received - Verőce Hills Guest House

📋 BOOKING DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━
• Booking ID: ${booking.id}
• Room Type: ${roomName}
• Guest Name: ${booking.guestName}
• Email: ${booking.guestEmail}
• Phone: ${booking.guestPhone}
• Number of Guests: ${booking.guests}

📅 DATES:
━━━━━━━━━━━━━━━━━━━━━━━━━━
• Check-in: ${checkInDate}
• Check-out: ${checkOutDate}
• Duration: ${nights} night${nights > 1 ? 's' : ''}

💰 PRICING:
━━━━━━━━━━━━━━━━━━━━━━━━━━
• Rate: €${booking.roomType === 'single-bed' ? 80 : 
              booking.roomType === 'double-bed' ? 100 :
              booking.roomType === 'bunk-bed' ? 90 : 150}/night
• Total: €${totalPrice}

⏰ Booking submitted: ${new Date().toLocaleString('en-GB')}

Please contact the guest to confirm their booking and arrange payment details.
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'valeriano.donzelli@gmail.com',
        subject: `🏠 New Booking: ${booking.guestName} - ${roomName}`,
        text: emailContent,
        html: emailContent.replace(/\n/g, '<br>').replace(/━/g, '─')
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Booking notification email sent for booking ${booking.id}`);
      return true;
    } catch (error) {
      console.error('Error sending booking notification email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();