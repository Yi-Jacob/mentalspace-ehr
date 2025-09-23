import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY is not configured');
      // throw new Error('RESEND_API_KEY is required for email service');
    }
    this.resend = new Resend(apiKey);
  }

  async sendPasswordSetupEmail(
    to: string,
    firstName: string,
    lastName: string,
    resetUrl: string,
  ): Promise<void> {
    try {
      const fromEmail = this.configService.get<string>('EMAIL_FROM') || 'mentalspace-test@gmail.com';
      
      const emailData = {
        from: fromEmail,
        to: [to],
        subject: 'Welcome to MentalSpace - Set Up Your Password',
        html: this.getPasswordSetupEmailTemplate(firstName, lastName, resetUrl, to),
      };

      const result = await this.resend.emails.send(emailData);
      
      if (result.error) {
        this.logger.error(`Failed to send password setup email to ${to}:`, result.error);
        throw new Error(`Email sending failed: ${result.error.message}`);
      }

      this.logger.log(`Password setup email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(`Error sending password setup email to ${to}:`, error);
      throw error;
    }
  }

  async sendPasswordResetEmail(
    to: string,
    firstName: string,
    lastName: string,
    resetUrl: string,
  ): Promise<void> {
    try {
      const fromEmail = this.configService.get<string>('EMAIL_FROM') || 'mentalspace-test@gmail.com';
      
      const emailData = {
        from: fromEmail,
        to: [to],
        subject: 'MentalSpace - Reset Your Password',
        html: this.getPasswordResetEmailTemplate(firstName, lastName, resetUrl, to),
      };

      const result = await this.resend.emails.send(emailData);
      
      if (result.error) {
        this.logger.error(`Failed to send password reset email to ${to}:`, result.error);
        throw new Error(`Email sending failed: ${result.error.message}`);
      }

      this.logger.log(`Password reset email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(`Error sending password reset email to ${to}:`, error);
      throw error;
    }
  }

  private getPasswordSetupEmailTemplate(
    firstName: string,
    lastName: string,
    resetUrl: string,
    email: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to MentalSpace</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
          }
          .welcome-text {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .content {
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
            border: none;
          }
          .button:hover {
            background-color: #1d4ed8;
            color: #ffffff !important;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
          }
          .security-note {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">MentalSpace</div>
            <div class="welcome-text">Welcome to your secure mental health platform</div>
          </div>
          
          <div class="content">
            <p>Dear ${firstName} ${lastName},</p>
            
            <p>Welcome to MentalSpace! Your account has been created and you're ready to get started with your mental health journey.</p>
            
            <p>To complete your account setup, please click the button below to set up your secure password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Set Up My Password</a>
            </div>
            
            <div class="security-note">
              <strong>Security Note:</strong> This link will expire in 10 minutes for your security. If you don't set up your password within this time, please contact your healthcare provider to request a new setup link.
            </div>
            
            <p>Once you've set up your password, you'll be able to:</p>
            <ul>
              <li>Access your secure patient portal</li>
              <li>View your appointments and treatment information</li>
              <li>Communicate securely with your healthcare team</li>
              <li>Access your mental health resources and tools</li>
            </ul>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact your healthcare provider.</p>
            
            <p>Best regards,<br>
            The MentalSpace Team</p>
          </div>
          
          <div class="footer">
            <p>This email was sent to ${email}. If you did not expect this email, please contact your healthcare provider.</p>
            <p>© 2024 MentalSpace. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getPasswordResetEmailTemplate(
    firstName: string,
    lastName: string,
    resetUrl: string,
    email: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - MentalSpace</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
          }
          .welcome-text {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .content {
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
            border: none;
          }
          .button:hover {
            background-color: #1d4ed8;
            color: #ffffff !important;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
            text-align: center;
          }
          .security-note {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">MentalSpace</div>
            <div class="welcome-text">Reset Your Password</div>
          </div>
          
          <div class="content">
            <p>Dear ${firstName} ${lastName},</p>
            
            <p>You have requested to reset your password for your MentalSpace account. Here is your reset password link:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset My Password</a>
            </div>
            
            <div class="security-note">
              <strong>Security Note:</strong> This link will expire in 10 minutes for your security. If you don't reset your password within this time, please contact your healthcare provider to request a new reset link.
            </div>
            
            <p>If you did not request this password reset, please ignore this email and contact your healthcare provider immediately.</p>
            
            <p>Best regards,<br>
            The MentalSpace Team</p>
          </div>
          
          <div class="footer">
            <p>This email was sent to ${email}. If you did not expect this email, please contact your healthcare provider.</p>
            <p>© 2024 MentalSpace. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
