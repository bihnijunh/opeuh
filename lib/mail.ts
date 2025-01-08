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

export const sendFlightBookingConfirmationEmail = async (
  email: string,
  bookingDetails: {
    ticketNumber: string;
    passengerName: string;
    flightNumber: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: Date;
    arrivalTime: Date;
  }
) => {
  const { ticketNumber, passengerName, flightNumber, departureAirport, arrivalAirport, departureTime, arrivalTime } = bookingDetails;

  await resend.emails.send({
    from: "Milano Shipping Logistics <noreply@milanoship.com>",
    to: email,
    subject: "Flight Booking Confirmation",
    html: emailTemplate(`
      <div class="header">
        <h1>Flight Booking Confirmation</h1>
      </div>
      <div class="content">
        <h2>Dear ${passengerName},</h2>
        <p>Your flight booking has been confirmed. Here are your flight details:</p>
        <ul>
          <li>Ticket Number: ${ticketNumber}</li>
          <li>Flight Number: ${flightNumber}</li>
          <li>From: ${departureAirport}</li>
          <li>To: ${arrivalAirport}</li>
          <li>Departure: ${departureTime.toLocaleString()}</li>
          <li>Arrival: ${arrivalTime.toLocaleString()}</li>
        </ul>
        <p>Please arrive at the airport at least 2 hours before your scheduled departure time.</p>
        <p>Thank you for choosing Milano Shipping Logistics!</p>
      </div>
    `)
  });
};