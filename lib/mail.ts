import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

const emailTemplate = (content: string) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Milano Shipping Logistics</title>
    <style>
      body { 
        font-family: Arial, sans-serif; 
        line-height: 1.6; 
        color: #333; 
        margin: 0; 
        padding: 0;
      }
      .container { 
        max-width: 600px; 
        margin: 0 auto; 
        padding: 20px; 
        width: 100%; 
        box-sizing: border-box;
      }
      .header { 
        background-color: #d40511; 
        color: white; 
        padding: 20px; 
        text-align: center; 
      }
      .content { 
        background-color: #f9f9f9; 
        padding: 20px; 
        border-radius: 5px; 
      }
      .button { 
        display: inline-block; 
        padding: 10px 20px; 
        background-color: #d40511; 
        color: white; 
        text-decoration: none; 
        border-radius: 5px; 
      }
      @media only screen and (max-width: 600px) {
        .container {
          width: 100% !important;
          padding: 10px !important;
        }
        .header {
          padding: 15px !important;
        }
        .content {
          padding: 15px !important;
        }
        .button {
          display: block;
          width: 100%;
          text-align: center;
          box-sizing: border-box;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin: 0; font-size: 24px;">Milano Shipping Logistics</h1>
      </div>
      <div class="content">
        ${content}
      </div>
    </div>
  </body>
  </html>
`;

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {
  const content = `
    <h2>Your Two-Factor Authentication Code</h2>
    <p>Use the following code to complete your login:</p>
    <h3 style="font-size: 24px; background-color: #e9e9e9; padding: 10px; text-align: center;">${token}</h3>
    <p>This code will expire in 5 minutes.</p>
    <p>If you didn't request this code, please ignore this email.</p>
  `;

  await resend.emails.send({
    from: "mail@milanosailexpress.com",
    to: email,
    subject: "Your 2FA Code - Milano Shipping Logistics",
    html: emailTemplate(content)
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string
) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  const content = `
    <h2>Reset Your Password</h2>
    <p>Click the button below to reset your password:</p>
    <a href="${resetLink}" class="button">Reset Password</a>
    <p>If you didn't request a password reset, please ignore this email.</p>
    <p>This link will expire in 1 hour.</p>
  `;

  await resend.emails.send({
    from: "mail@milanosailexpress.com",
    to: email,
    subject: "Reset Your Password - Milano Shipping Logistics",
    html: emailTemplate(content)
  });
};

export const sendVerificationEmail = async (
  email: string, 
  token: string
) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  const content = `
    <h2>Verify Your Email Address</h2>
    <p>Thank you for registering with Milano Shipping Logistics. Please click the button below to verify your email address:</p>
    <p style="text-align: center;">
      <a href="${confirmLink}" class="button">Verify Email</a>
    </p>
    <p>If you didn't create an account with us, you can safely ignore this email.</p>
    <p>This link will expire in 24 hours.</p>
  `;

  await resend.emails.send({
    from: "verify@milanosailexpress.com",
    to: email,
    subject: "Verify Your Email - Milano Shipping Logistics",
    html: emailTemplate(content)
  });
};

export async function sendFlightBookingConfirmationEmail(
  email: string,
  bookingDetails: {
    ticketNumber: string;
    passengerName: string;
    flightNumber: string;
    fromCity: string;
    toCity: string;
    departureDate: Date;
    returnDate?: Date | null;
  }
) {
  const { ticketNumber, passengerName, flightNumber, fromCity, toCity, departureDate, returnDate } = bookingDetails;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short'
    }).format(new Date(date));
  };

  const flightStatusUrl = `${process.env.NEXT_PUBLIC_APP_URL}/flights/status/${ticketNumber}`;

  const content = `
    <div class="content" style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto;">
      <!-- Header with animated background -->
      <div style="background: linear-gradient(45deg, #003366, #1a4d80); padding: 30px; border-radius: 10px 10px 0 0; text-align: center; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTAgMTBMOTAgOTBIMTBMNTAgMTB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=') repeat; animation: slide 20s linear infinite;"></div>
        <h1 style="color: white; margin: 0; position: relative; font-size: 28px;">✈️ Flight Confirmation</h1>
      </div>

      <!-- Passenger Info Card -->
      <div style="background: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #003366; margin-top: 0;">Hello ${passengerName} 👋</h2>
        <p style="color: #666; line-height: 1.6;">Your flight has been successfully booked!</p>
      </div>

      <!-- Flight Details Card -->
      <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 20px 0;">
        <!-- Flight Route Visualization -->
        <div style="padding: 40px 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin: 20px 0; flex-wrap: wrap;">
            <div style="text-align: center; flex: 1; min-width: 150px; padding: 20px;">
              <div style="font-size: 48px; margin-bottom: 15px;">🛫</div>
              <div style="font-weight: bold; color: #003366; font-size: 18px;">${fromCity}</div>
              <div style="color: #666; font-size: 14px; margin-top: 5px;">${formatDate(departureDate).split(',')[0]}</div>
            </div>
            
            <div style="flex: 2; min-width: 200px; position: relative; padding: 20px 0;">
              <div style="border-top: 3px dashed #003366; margin: 0 20px;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #f8f9fa; padding: 15px; border-radius: 50%;">
                  <div style="font-size: 36px; transform: rotate(90deg) translateX(2px); display: inline-block;">✈️</div>
                </div>
              </div>
            </div>
            
            <div style="text-align: center; flex: 1; min-width: 150px; padding: 20px;">
              <div style="font-size: 48px; margin-bottom: 15px;">🛬</div>
              <div style="font-weight: bold; color: #003366; font-size: 18px;">${toCity}</div>
              <div style="color: #666; font-size: 14px; margin-top: 5px;">
                ${returnDate ? formatDate(returnDate).split(',')[0] : formatDate(departureDate).split(',')[0]}
              </div>
            </div>
          </div>
        </div>

        <!-- Flight Info -->
        <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <span style="color: #666;">🎫 Ticket Number</span>
                <br>
                <strong>${ticketNumber}</strong>
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <span style="color: #666;">✈️ Flight Number</span>
                <br>
                <strong>${flightNumber}</strong>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px;">
                <span style="color: #666;">📅 Departure</span>
                <br>
                <strong>${formatDate(departureDate)}</strong>
              </td>
              ${returnDate ? `
              <td style="padding: 10px;">
                <span style="color: #666;">🔄 Return</span>
                <br>
                <strong>${formatDate(returnDate)}</strong>
              </td>
              ` : ''}
            </tr>
          </table>
        </div>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${flightStatusUrl}" style="display: inline-block; background-color: #003366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; transition: all 0.3s ease;">
          Check Flight Status →
        </a>
      </div>

      <!-- Important Information -->
      <div style="background: #fff4e6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #ff9800; margin-top: 0;">⚠️ Important Information</h3>
        <ul style="list-style-type: none; padding: 0; margin: 0;">
          <li style="padding: 10px 0; border-bottom: 1px solid rgba(255,152,0,0.2);">
            ⏰ Arrive at least 2 hours before departure
          </li>
          <li style="padding: 10px 0; border-bottom: 1px solid rgba(255,152,0,0.2);">
            🪪 Bring a valid ID or passport
          </li>
          <li style="padding: 10px 0;">
            🧳 Check baggage policy for allowed items
          </li>
        </ul>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
        <p>Need help? Contact our customer service</p>
        <div style="margin-top: 10px;">
          <a href="${flightStatusUrl}" style="color: #003366; text-decoration: none;">View booking online →</a>
        </div>
      </div>
    </div>

    <style>
      @keyframes slide {
        from { background-position: 0 0; }
        to { background-position: 100% 0; }
      }
    </style>
  `;

  try {
    await resend.emails.send({
      from: "Milano Shipping Logistics <bookings@milanosailexpress.com>",
      to: email,
      subject: `Flight Booking Confirmation - Ticket #${ticketNumber}`,
      html: emailTemplate(content),
    });
  } catch (error) {
    console.error("Failed to send flight booking confirmation email:", error);
  }
}