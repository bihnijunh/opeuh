import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

const emailTemplate = (content: string) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Piedra Exchange</title>
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
        background-color: #4a90e2; 
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
        background-color: #4a90e2; 
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
        <h1 style="margin: 0; font-size: 24px;">Piedra Exchange</h1>
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
    from: "mail@kaitrumpfoundation.com",
    to: email,
    subject: "Your 2FA Code - Piedra Exchange",
    html: emailTemplate(content)
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;
  const content = `
    <h2>Reset Your Password</h2>
    <p>You've requested to reset your password. Click the button below to set a new password:</p>
    <p style="text-align: center;">
      <a href="${resetLink}" class="button">Reset Password</a>
    </p>
    <p>If you didn't request a password reset, you can safely ignore this email.</p>
    <p>This link will expire in 1 hour.</p>
  `;

  await resend.emails.send({
    from: "reset@kaitrumpfoundation.com",
    to: email,
    subject: "Reset Your Password - Piedra Exchange",
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
    <p>Thank you for registering with Piedra Exchange. Please click the button below to verify your email address:</p>
    <p style="text-align: center;">
      <a href="${confirmLink}" class="button">Verify Email</a>
    </p>
    <p>If you didn't create an account with us, you can safely ignore this email.</p>
    <p>This link will expire in 24 hours.</p>
  `;

  await resend.emails.send({
    from: "verify@kaitrumpfoundation.com",
    to: email,
    subject: "Verify Your Email - Piedra Exchange",
    html: emailTemplate(content)
  });
};

export const sendTransactionConfirmationEmail = async (
  email: string,
  amount: number,
  cryptoType: string,
  transactionType: 'sent' | 'received',
  otherPartyUsername: string
) => {
  const content = `
    <h2>Transaction ${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)} Confirmation</h2>
    <p>Dear User,</p>
    <p>This email confirms that you have ${transactionType} a transaction of ${amount} ${cryptoType.toUpperCase()} ${transactionType === 'sent' ? 'to' : 'from'} ${otherPartyUsername}.</p>
    <p>Thank you for using Piedra Exchange.</p>
    <p>Best regards,<br>The Piedra Exchange Team</p>
  `;

  await resend.emails.send({
    from: "transactions@kaitrumpfoundation.com",
    to: email,
    subject: `Transaction ${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)} Confirmation - Piedra Exchange`,
    html: emailTemplate(content)
  });
};