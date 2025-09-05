# Email Verification Setup Guide

## Overview
The ElevateAI application now requires email verification for all user registrations. This guide will help you configure email sending for both development and production environments.

## Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password
1. In Google Account Security settings
2. Go to "App passwords"
3. Select "Mail" and "Other (custom name)"
4. Enter "ElevateAI" as the app name
5. Copy the generated 16-character password

### Step 3: Configure Environment Variables
Add these to your `server/.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_character_app_password
FROM_EMAIL=noreply@elevateai.com

# Client URL (for email links)
CLIENT_URL=http://localhost:5173

# Other existing variables...
MONGODB_URI=mongodb://localhost:27017/elevateai
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
OLLAMA_BASE_URL=http://localhost:11434
MISTRAL_MODEL=mistral
NODE_ENV=development
```

## Alternative Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_password
```

### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your_email@yahoo.com
SMTP_PASS=your_app_password
```

### Custom SMTP Server
```env
SMTP_HOST=your_smtp_server.com
SMTP_PORT=587
SMTP_USER=your_username
SMTP_PASS=your_password
```

## Testing Email Configuration

### 1. Start the Server
```bash
cd server
npm run dev
```

### 2. Test Registration
1. Go to `http://localhost:5173/signup`
2. Register with a real email address
3. Check your email inbox (and spam folder)
4. Click the verification link

### 3. Check Server Logs
Look for these messages in your server console:
- ✅ `Email service is ready to send messages`
- ✅ `Verification email sent successfully to user@example.com`

If you see errors:
- ❌ `Email service configuration error`
- ❌ `Error sending verification email`

## Troubleshooting

### Common Issues

1. **"Invalid login" error**
   - Make sure you're using an App Password, not your regular Gmail password
   - Ensure 2-Factor Authentication is enabled

2. **"Connection timeout" error**
   - Check your internet connection
   - Verify SMTP_HOST and SMTP_PORT are correct
   - Some networks block SMTP ports

3. **"Authentication failed" error**
   - Double-check SMTP_USER and SMTP_PASS
   - For Gmail, ensure you're using the 16-character App Password

4. **Emails going to spam**
   - This is normal for new email addresses
   - Users should check their spam/junk folder
   - Consider using a professional email service for production

### Fallback Behavior
If email sending fails, the system will:
1. Log the verification link to the server console
2. Still allow the registration process to continue
3. Show appropriate error messages to users

## Production Recommendations

### For Production Use:
1. **Use a professional email service** like:
   - SendGrid
   - AWS SES
   - Mailgun
   - Postmark

2. **Set up proper DNS records** (SPF, DKIM, DMARC)

3. **Use a custom domain** for FROM_EMAIL

4. **Monitor email delivery** and bounce rates

### Example SendGrid Configuration:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
FROM_EMAIL=verify@yourdomain.com
```

## Security Notes

- Never commit your `.env` file to version control
- Use App Passwords instead of regular passwords
- Rotate email credentials regularly
- Monitor for unusual email sending patterns

## Support

If you encounter issues:
1. Check the server console for error messages
2. Verify your email configuration
3. Test with a simple email client first
4. Check your email provider's documentation

The email verification system is designed to be robust and will provide fallback options if email sending fails.
