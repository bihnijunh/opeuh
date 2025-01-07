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

export const sendFlightBookingConfirmationEmail = async (
  email: string,
  ticketNumber: string,
  flightDetails: {
    departure: string;
    arrival: string;
    date: string;
    time: string;
  },
  passengerName: string
) => {
  const content = `
    <h2>Flight Booking Confirmation</h2>
    <p>Dear ${passengerName},</p>
    <p>Your flight booking has been confirmed. Here are your flight details:</p>
    <div style="background-color: #e9e9e9; padding: 15px; margin: 15px 0; border-radius: 5px;">
      <p><strong>Ticket Number:</strong> ${ticketNumber}</p>
      <p><strong>Departure:</strong> ${flightDetails.departure}</p>
      <p><strong>Arrival:</strong> ${flightDetails.arrival}</p>
      <p><strong>Date:</strong> ${flightDetails.date}</p>
      <p><strong>Time:</strong> ${flightDetails.time}</p>
    </div>
    <p>Please arrive at the airport at least 2 hours before your scheduled departure time.</p>
    <p>Thank you for choosing Milano Shipping Logistics!</p>
  `;

  await resend.emails.send({
    from: "mail@milanosailexpress.com",
    to: email,
    subject: "Flight Booking Confirmation - Milano Shipping Logistics",
    html: emailTemplate(content)
  });
};