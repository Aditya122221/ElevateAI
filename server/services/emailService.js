const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Use Gmail SMTP as default for reliable email delivery
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'your_email@gmail.com',
        pass: process.env.SMTP_PASS || 'your_app_password'
      }
    });

    // Verify connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        console.log('Email service configuration error:', error);
        console.log('Please configure SMTP_USER and SMTP_PASS in your .env file');
        console.log('For Gmail, use an App Password instead of your regular password');
      } else {
        console.log('Email service is ready to send messages');
      }
    });
  }

  async sendVerificationEmail(email, name, verificationToken) {
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: `"ElevateAI" <${process.env.FROM_EMAIL || 'noreply@elevateai.com'}>`,
      to: email,
      subject: 'Verify Your Email - ElevateAI',
      html: this.getVerificationEmailTemplate(name, verificationUrl),
      text: this.getVerificationEmailText(name, verificationUrl)
    };

    try {
      // Always try to send the email
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent successfully to ${email}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending verification email:', error);

      // If email sending fails, log the verification link as fallback
      console.log('\n=== EMAIL SENDING FAILED - VERIFICATION LINK ===');
      console.log(`To: ${email}`);
      console.log(`Subject: Verify Your Email - ElevateAI`);
      console.log(`Verification Link: ${verificationUrl}`);
      console.log('===============================================\n');

      // Still return success but with a note about the fallback
      return {
        success: true,
        messageId: 'fallback-mode',
        warning: 'Email sending failed, verification link logged to console'
      };
    }
  }

  getVerificationEmailTemplate(name, verificationUrl) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - ElevateAI</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ElevateAI!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>Thank you for signing up for ElevateAI. To complete your registration and start your AI-powered learning journey, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
            
            <p><strong>Important:</strong> This verification link will expire in 24 hours for security reasons.</p>
            
            <p>If you didn't create an account with ElevateAI, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 ElevateAI. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getVerificationEmailText(name, verificationUrl) {
    return `
Welcome to ElevateAI!

Hi ${name}!

Thank you for signing up for ElevateAI. To complete your registration and start your AI-powered learning journey, please verify your email address by visiting the following link:

${verificationUrl}

Important: This verification link will expire in 24 hours for security reasons.

If you didn't create an account with ElevateAI, please ignore this email.

© 2024 ElevateAI. All rights reserved.
This is an automated message, please do not reply to this email.
    `;
  }
}

module.exports = new EmailService();
