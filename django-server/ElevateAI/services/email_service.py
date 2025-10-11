import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """Email service for sending verification and password reset emails"""
    
    def __init__(self):
        self.smtp_host = getattr(settings, 'SMTP_HOST', 'smtp.gmail.com')
        self.smtp_port = getattr(settings, 'SMTP_PORT', 587)
        self.smtp_user = getattr(settings, 'SMTP_USER', 'your_email@gmail.com')
        self.smtp_pass = getattr(settings, 'SMTP_PASS', 'your_app_password')
        self.from_email = getattr(settings, 'FROM_EMAIL', 'noreply@elevateai.com')
        self.client_url = getattr(settings, 'CLIENT_URL', 'http://localhost:5173')
    
    def send_verification_email(self, email, name, verification_token):
        """Send email verification email"""
        verification_url = f"{self.client_url}/verify-email?token={verification_token}"
        
        subject = 'Verify Your Email - ElevateAI'
        html_content = self._get_verification_email_template(name, verification_url)
        text_content = self._get_verification_email_text(name, verification_url)
        
        return self._send_email(email, subject, html_content, text_content)
    
    def send_password_reset_email(self, email, name, reset_url):
        """Send password reset email"""
        subject = 'Password Reset Request - ElevateAI'
        html_content = self._get_password_reset_email_template(name, reset_url)
        text_content = self._get_password_reset_email_text(name, reset_url)
        
        return self._send_email(email, subject, html_content, text_content)
    
    def _send_email(self, to_email, subject, html_content, text_content):
        """Send email using SMTP"""
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"ElevateAI <{self.from_email}>"
            msg['To'] = to_email
            
            # Add text and HTML parts
            text_part = MIMEText(text_content, 'plain')
            html_part = MIMEText(html_content, 'html')
            
            msg.attach(text_part)
            msg.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_pass)
                server.send_message(msg)
            
            logger.info(f"Email sent successfully to {to_email}")
            return {'success': True, 'messageId': f'email-{to_email}'}
            
        except Exception as error:
            logger.error(f"Error sending email to {to_email}: {error}")
            
            # Log the email content as fallback
            logger.info(f"\n=== EMAIL SENDING FAILED - VERIFICATION LINK ===")
            logger.info(f"To: {to_email}")
            logger.info(f"Subject: {subject}")
            if 'verification' in subject.lower():
                logger.info(f"Verification Link: {self.client_url}/verify-email?token={verification_token}")
            logger.info("===============================================\n")
            
            return {
                'success': True,
                'messageId': 'fallback-mode',
                'warning': 'Email sending failed, verification link logged to console'
            }
    
    def _get_verification_email_template(self, name, verification_url):
        """Get HTML template for verification email"""
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email - ElevateAI</title>
          <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .button {{ display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
            .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ElevateAI!</h1>
            </div>
            <div class="content">
              <h2>Hi {name}!</h2>
              <p>Thank you for signing up for ElevateAI. To complete your registration and start your AI-powered learning journey, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="{verification_url}" class="button">Verify Email Address</a>
              </div>
              
              <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">{verification_url}</p>
              
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
        """
    
    def _get_verification_email_text(self, name, verification_url):
        """Get text template for verification email"""
        return f"""
        Welcome to ElevateAI!

        Hi {name}!

        Thank you for signing up for ElevateAI. To complete your registration and start your AI-powered learning journey, please verify your email address by visiting the following link:

        {verification_url}

        Important: This verification link will expire in 24 hours for security reasons.

        If you didn't create an account with ElevateAI, please ignore this email.

        © 2024 ElevateAI. All rights reserved.
        This is an automated message, please do not reply to this email.
        """
    
    def _get_password_reset_email_template(self, name, reset_url):
        """Get HTML template for password reset email"""
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - ElevateAI</title>
          <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .button {{ display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
            .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hi {name}!</h2>
              <p>You have requested to reset your password for your ElevateAI account. Please click the button below to set a new password:</p>
              
              <div style="text-align: center;">
                <a href="{reset_url}" class="button">Reset Your Password</a>
              </div>
              
              <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">{reset_url}</p>
              
              <p><strong>Important:</strong> This password reset link will expire in 1 hour for security reasons.</p>
              
              <p>If you did not request a password reset, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2024 ElevateAI. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
        """
    
    def _get_password_reset_email_text(self, name, reset_url):
        """Get text template for password reset email"""
        return f"""
        Password Reset Request - ElevateAI

        Hi {name}!

        You have requested to reset your password for your ElevateAI account. Please visit the following link to set a new password:

        {reset_url}

        Important: This password reset link will expire in 1 hour for security reasons.

        If you did not request a password reset, please ignore this email.

        © 2024 ElevateAI. All rights reserved.
        This is an automated message, please do not reply to this email.
        """
