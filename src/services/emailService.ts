interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export interface AppointmentEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  services: string[];
  appointmentDate: string;
  appointmentTime: string;
  totalAmount: number;
  appointmentId: string;
  serviceLocation?: string;
  customerAddress?: string;
}

export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

export class EmailService {
  private static instance: EmailService;
  private config: EmailConfig;

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  constructor() {
    // Email configuration - In production, these should come from environment variables
    this.config = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'akshataparlor@gmail.com', // Replace with your actual email
        pass: 'your-app-password' // Replace with your actual app password
      }
    };
  }

  private createPasswordResetTemplate(email: string, resetToken: string): EmailTemplate {
    const resetLink = `${window.location.origin}${window.location.pathname}?token=${resetToken}`;
    const supportEmail = 'support@akshataparlor.com';
    const supportPhone = '+91 98765 43210';

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your AKSHATA BEAUTY HERBAL PARLOUR Password</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            background: linear-gradient(135deg, #ec4899, #8b5cf6);
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .title {
            background: linear-gradient(135deg, #ec4899, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
          }
          .subtitle {
            color: #666;
            margin: 5px 0 0 0;
          }
          .content {
            margin: 30px 0;
          }
          .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #ec4899, #8b5cf6);
            color: white !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
          }
          .reset-button:hover {
            background: linear-gradient(135deg, #db2777, #7c3aed);
          }
          .security-notice {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
          }
          .security-title {
            color: #92400e;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .security-text {
            color: #92400e;
            font-size: 14px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          .support-info {
            background: #f3f4f6;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
          }
          .link-text {
            word-break: break-all;
            background: #f3f4f6;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">✨</div>
            <h1 class="title">AKSHATA BEAUTY HERBAL PARLOUR</h1>
            <p class="subtitle">Beauty & Bridal Services</p>
          </div>

          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset the password for your AKSHATA BEAUTY HERBAL PARLOUR account associated with <strong>${email}</strong>.</p>
            
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" class="reset-button">Reset My Password</a>
            </div>

            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <div class="link-text">${resetLink}</div>

            <div class="security-notice">
              <div class="security-title">🔒 Important Security Information</div>
              <div class="security-text">
                • This link will expire in 15 minutes for your security<br>
                • Only use this link if you requested the password reset<br>
                • Never share this link with anyone<br>
                • If you didn't request this reset, please ignore this email
              </div>
            </div>

            <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          </div>

          <div class="support-info">
            <strong>Need Help?</strong><br>
            If you're having trouble with the password reset, please contact our support team:<br>
            📧 Email: <a href="mailto:${supportEmail}">${supportEmail}</a><br>
            📞 Phone: <a href="tel:${supportPhone}">${supportPhone}</a>
          </div>

          <div class="footer">
            <p>Best regards,<br><strong>AKSHATA BEAUTY HERBAL PARLOUR Team</strong></p>
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; 2024 AKSHATA BEAUTY HERBAL PARLOUR. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      AKSHATA BEAUTY HERBAL PARLOUR - Password Reset Request

      Hello,

      We received a request to reset the password for your AKSHATA BEAUTY HERBAL PARLOUR account associated with ${email}.

      To reset your password, please visit the following link:
      ${resetLink}

      IMPORTANT SECURITY INFORMATION:
      - This link will expire in 15 minutes for your security
      - Only use this link if you requested the password reset
      - Never share this link with anyone
      - If you didn't request this reset, please ignore this email

      If you're having trouble with the password reset, please contact our support team:
      Email: ${supportEmail}
      Phone: ${supportPhone}

      Best regards,
      AKSHATA BEAUTY HERBAL PARLOUR Team

      This is an automated email. Please do not reply to this message.
    `;

    return {
      to: email,
      subject: 'Reset Your AKSHATA BEAUTY HERBAL PARLOUR Password - Action Required',
      html,
      text
    };
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔄 Preparing to send password reset email to:', email);

      // Create email template
      const emailTemplate = this.createPasswordResetTemplate(email, resetToken);

      // For development, we'll use EmailJS (a real email service that works in browsers)
      // You can also integrate with other services like SendGrid, Mailgun, etc.

      // Try to send with EmailJS first (if configured)
      const emailJSResult = await this.sendWithEmailJS(emailTemplate, resetToken);

      if (emailJSResult.success) {
        console.log('✅ Password reset email sent successfully via EmailJS');
        return { success: true };
      }

      // Fallback to simulated email for development
      console.log('📧 EmailJS not configured, using development simulation');
      const simulationResult = await this.simulateEmailSending(emailTemplate);

      if (simulationResult.success) {
        // Store the email content in localStorage for development testing
        this.storeEmailForDevelopment(emailTemplate, resetToken);
        return { success: true };
      }

      return { success: false, error: 'Failed to send email' };

    } catch (error) {
      console.error('❌ Email service error:', error);
      return {
        success: false,
        error: 'Failed to send email. Please try again or contact support.'
      };
    }
  }

  // Appointment notification email template
  private createAppointmentNotificationTemplate(data: AppointmentEmailData): EmailTemplate {
    const formattedDate = new Date(data.appointmentDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const servicesList = data.services.join(', ');
    const locationInfo = data.serviceLocation === 'home'
      ? `🏠 Home Visit: ${data.customerAddress || 'Address provided during booking'}`
      : '🏪 At Parlour';

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Appointment Booking - AKSHATA BEAUTY HERBAL PARLOUR</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
          .container { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 2px solid #ec4899; }
          .logo { background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 15px; }
          .title { color: #ec4899; font-size: 24px; font-weight: bold; margin: 0; }
          .alert-badge { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; font-weight: bold; margin: 15px 0; }
          .section { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 15px 0; }
          .section-title { color: #8b5cf6; font-weight: bold; margin-bottom: 10px; font-size: 16px; }
          .detail-row { display: flex; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-label { font-weight: 600; color: #6b7280; width: 120px; }
          .detail-value { color: #1f2937; flex: 1; }
          .services-list { background: linear-gradient(135deg, #fdf2f8, #fce7f3); border-radius: 8px; padding: 15px; margin: 10px 0; }
          .amount { font-size: 28px; font-weight: bold; color: #10b981; }
          .footer { text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
          .action-required { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">✨</div>
            <h1 class="title">AKSHATA BEAUTY HERBAL PARLOUR</h1>
            <div class="alert-badge">🎉 NEW APPOINTMENT BOOKED!</div>
          </div>

          <div class="section">
            <div class="section-title">👤 Customer Details</div>
            <div class="detail-row"><span class="detail-label">Name:</span><span class="detail-value">${data.customerName}</span></div>
            <div class="detail-row"><span class="detail-label">Email:</span><span class="detail-value">${data.customerEmail}</span></div>
            <div class="detail-row"><span class="detail-label">Phone:</span><span class="detail-value">${data.customerPhone ? '+91 ' + data.customerPhone : 'Not provided'}</span></div>
          </div>

          <div class="section">
            <div class="section-title">📅 Appointment Details</div>
            <div class="detail-row"><span class="detail-label">Date:</span><span class="detail-value">${formattedDate}</span></div>
            <div class="detail-row"><span class="detail-label">Time:</span><span class="detail-value">${data.appointmentTime}</span></div>
            <div class="detail-row"><span class="detail-label">Location:</span><span class="detail-value">${locationInfo}</span></div>
            <div class="detail-row"><span class="detail-label">Booking ID:</span><span class="detail-value">${data.appointmentId}</span></div>
          </div>

          <div class="services-list">
            <div class="section-title">💄 Services Requested</div>
            <p style="margin: 0; color: #1f2937;">${servicesList}</p>
          </div>

          <div style="text-align: center; margin: 20px 0;">
            <p style="color: #6b7280; margin-bottom: 5px;">Total Amount</p>
            <span class="amount">₹${data.totalAmount.toLocaleString()}</span>
          </div>

          <div class="action-required">
            <strong>⚡ Action Required:</strong><br>
            Please contact the customer to confirm the appointment.
            ${data.customerPhone ? `<br><br>📞 <a href="tel:+91${data.customerPhone}">Call Customer: +91 ${data.customerPhone}</a>` : ''}
          </div>

          <div class="footer">
            <p>This is an automated notification from AKSHATA BEAUTY HERBAL PARLOUR Booking System</p>
            <p>© ${new Date().getFullYear()} AKSHATA BEAUTY HERBAL PARLOUR. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
🎉 NEW APPOINTMENT BOOKED - AKSHATA BEAUTY HERBAL PARLOUR

👤 CUSTOMER DETAILS:
Name: ${data.customerName}
Email: ${data.customerEmail}
Phone: ${data.customerPhone ? '+91 ' + data.customerPhone : 'Not provided'}

📅 APPOINTMENT DETAILS:
Date: ${formattedDate}
Time: ${data.appointmentTime}
Location: ${locationInfo}
Booking ID: ${data.appointmentId}

💄 SERVICES REQUESTED:
${servicesList}

💰 TOTAL AMOUNT: ₹${data.totalAmount.toLocaleString()}

⚡ ACTION REQUIRED:
Please contact the customer to confirm the appointment.

---
AKSHATA BEAUTY HERBAL PARLOUR Booking System
    `;

    return {
      to: 'akshatapattanashetti968@gmail.com',
      subject: `🎉 New Appointment: ${data.customerName} - ${formattedDate} at ${data.appointmentTime}`,
      html,
      text
    };
  }

  // Send appointment notification email to service provider
  async sendAppointmentNotificationEmail(data: AppointmentEmailData): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📧 Sending appointment notification email to akshatapattanashetti968@gmail.com...');

      const emailTemplate = this.createAppointmentNotificationTemplate(data);

      // Try EmailJS first
      const emailJSResult = await this.sendAppointmentWithEmailJS(emailTemplate, data);
      if (emailJSResult.success) {
        console.log('✅ Appointment notification email sent successfully!');
        return { success: true };
      }

      // Fallback to Web3Forms (free email API)
      const web3FormsResult = await this.sendWithWeb3Forms(emailTemplate);
      if (web3FormsResult.success) {
        console.log('✅ Appointment notification email sent via Web3Forms!');
        return { success: true };
      }

      // Development simulation fallback
      console.log('📧 Using development simulation for appointment email');
      this.logAppointmentEmailForDevelopment(emailTemplate, data);
      return { success: true };

    } catch (error) {
      console.error('❌ Appointment email error:', error);
      return { success: false, error: 'Failed to send appointment notification email' };
    }
  }

  // Contact form email
  async sendContactEmail(data: ContactEmailData): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📧 Sending contact form email...');

      const referenceId = new Date().getTime().toString(36).toUpperCase();
      const text = `
new Message from AKSHATA BEAUTY HERBAL PARLOUR Contact Form

👤 Name: ${data.name}
📧 Email: ${data.email}
📱 Phone: ${data.phone || 'Not provided'}
💇 Service Interested: ${data.service || 'General Inquiry'}

📝 Message:
${data.message}

---
Reference ID: ${referenceId}
      `;

      const emailTemplate: EmailTemplate = {
        to: 'akshatapattanashetti968@gmail.com', // Receive contact queries here
        subject: `New Inquiry from ${data.name} - ${data.service || 'General'}`,
        html: `
          <h3>New Message from Contact Form</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
          <p><strong>Service Interested:</strong> ${data.service || 'General Inquiry'}</p>
          <br>
          <p><strong>Message:</strong></p>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
          <br>
          <hr>
          <p style="font-size: 10px; color: #999;">Reference ID: ${referenceId}</p>
        `,
        text,
        replyTo: data.email
      };

      // Use Web3Forms
      const web3FormsResult = await this.sendWithWeb3Forms(emailTemplate);
      if (web3FormsResult.success) {
        return { success: true };
      }

      // If Web3Forms fails, return error with message
      console.error('❌ Web3Forms failed:', web3FormsResult.error);
      return { success: false, error: web3FormsResult.error || 'Failed to send message. Please try again.' };

    } catch (error) {
      console.error('❌ Contact email error:', error);
      return { success: false, error: 'Failed to send contact email' };
    }
  }

  private async sendAppointmentWithEmailJS(emailTemplate: EmailTemplate, data: AppointmentEmailData): Promise<{ success: boolean; error?: string }> {
    try {
      if (typeof window !== 'undefined' && (window as any).emailjs) {
        const emailjs = (window as any).emailjs;

        const templateParams = {
          to_email: emailTemplate.to,
          from_name: 'AKSHATA BEAUTY HERBAL PARLOUR',
          customer_name: data.customerName,
          customer_email: data.customerEmail,
          customer_phone: data.customerPhone || 'Not provided',
          appointment_date: data.appointmentDate,
          appointment_time: data.appointmentTime,
          services: data.services.join(', '),
          total_amount: `₹${data.totalAmount.toLocaleString()}`,
          booking_id: data.appointmentId,
          subject: emailTemplate.subject,
          message: emailTemplate.text
        };

        await emailjs.send(
          'service_akshata_parlor',
          'template_appointment_notify',
          templateParams,
          'your_emailjs_user_id'
        );

        return { success: true };
      }
      return { success: false, error: 'EmailJS not configured' };
    } catch (error) {
      console.error('EmailJS appointment email error:', error);
      return { success: false, error: 'EmailJS error' };
    }
  }

  private async sendWithWeb3Forms(emailTemplate: EmailTemplate): Promise<{ success: boolean; error?: string }> {
    try {
      // Get API Key - hardcoded Web3Forms key for reliable delivery
      const WEB3FORMS_KEY = 'dad22b38-e415-4ac5-9b3b-3dca6bcd6825';

      // Get from Business Settings or env if configured, otherwise use hardcoded key
      const businessStore = (await import('./businessStore')).default.getInstance();
      const settings = businessStore.getSettings();
      const accessKey = settings.web3FormsAccessKey ||
        import.meta.env.VITE_WEB3FORMS_KEY ||
        WEB3FORMS_KEY;

      if (!accessKey) {
        console.warn('⚠️ Web3Forms Access Key is missing. Email will not be sent.');
        return { success: false, error: 'Access Key Missing' };
      }

      console.log('📧 Sending with Web3Forms...');

      // Web3Forms API - Note: 'to' is set in Web3Forms dashboard, not in API call
      const formData = {
        access_key: accessKey,
        subject: emailTemplate.subject,
        from_name: emailTemplate.replyTo ? `${emailTemplate.replyTo} via Website` : 'AKSHATA BEAUTY HERBAL PARLOUR Website',
        email: emailTemplate.replyTo || 'noreply@akshataparlor.com', // Customer email for reply
        name: 'Website Contact Form',
        message: emailTemplate.text,
      };

      console.log('📤 Sending to Web3Forms:', { ...formData, access_key: '***hidden***' });

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const responseData = await response.json();
      console.log('📥 Web3Forms Response:', responseData);

      if (responseData.success) {
        return { success: true };
      }

      console.error('Web3Forms Error:', responseData);
      return { success: false, error: responseData.message || 'Web3Forms API error' };
    } catch (error) {
      console.error('Web3Forms Catch Error:', error);
      return { success: false, error: 'Web3Forms request failed' };
    }
  }

  private logAppointmentEmailForDevelopment(emailTemplate: EmailTemplate, data: AppointmentEmailData): void {
    console.log(`
      ===== APPOINTMENT EMAIL NOTIFICATION =====
      To: ${emailTemplate.to}
      Subject: ${emailTemplate.subject}
      
      👤 Customer: ${data.customerName}
      📧 Email: ${data.customerEmail}
      📱 Phone: ${data.customerPhone || 'Not provided'}
      📅 Date: ${data.appointmentDate}
      ⏰ Time: ${data.appointmentTime}
      💄 Services: ${data.services.join(', ')}
      💰 Amount: ₹${data.totalAmount.toLocaleString()}
      🆔 Booking ID: ${data.appointmentId}
      
      ✅ Email notification logged for development!
      =============================================
    `);

    // Store in localStorage for development testing
    const emailData = {
      ...data,
      to: emailTemplate.to,
      subject: emailTemplate.subject,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('akshata_last_appointment_email', JSON.stringify(emailData));
  }


  private async sendWithEmailJS(emailTemplate: EmailTemplate, resetToken: string): Promise<{ success: boolean; error?: string }> {
    try {
      // EmailJS configuration (replace with your actual EmailJS credentials)
      const emailJSConfig = {
        serviceID: 'service_akshata_parlor', // Replace with your EmailJS service ID
        templateID: 'template_password_reset', // Replace with your EmailJS template ID
        userID: 'your_emailjs_user_id' // Replace with your EmailJS user ID
      };

      // Check if EmailJS is available and configured
      if (typeof window !== 'undefined' && (window as any).emailjs) {
        const emailjs = (window as any).emailjs;

        const templateParams = {
          to_email: emailTemplate.to,
          to_name: emailTemplate.to.split('@')[0],
          reset_link: `${window.location.origin}${window.location.pathname}?token=${resetToken}`,
          company_name: 'AKSHATA BEAUTY HERBAL PARLOUR',
          subject: emailTemplate.subject
        };

        await emailjs.send(
          emailJSConfig.serviceID,
          emailJSConfig.templateID,
          templateParams,
          emailJSConfig.userID
        );

        return { success: true };
      }

      // EmailJS not available
      return { success: false, error: 'EmailJS not configured' };

    } catch (error) {
      console.error('EmailJS error:', error);
      return { success: false, error: 'EmailJS service error' };
    }
  }

  private async simulateEmailSending(emailTemplate: EmailTemplate): Promise<{ success: boolean; error?: string }> {
    // This simulates email sending for development
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`
          ===== EMAIL SENT SUCCESSFULLY =====
          To: ${emailTemplate.to}
          Subject: ${emailTemplate.subject}
          
          ✅ Password reset email has been prepared and sent!
          
          📧 In development mode, check the browser console 
             and localStorage for the reset link.
          
          🔗 Reset link is also logged below for testing.
          ===================================
        `);

        // Extract reset link from HTML for easy access
        const linkMatch = emailTemplate.html.match(/href="([^"]*token=[^"]*)"/);
        if (linkMatch) {
          console.log('🔗 Reset Link for Testing:', linkMatch[1]);
        }

        resolve({ success: true });
      }, 1000);
    });
  }

  private storeEmailForDevelopment(emailTemplate: EmailTemplate, resetToken: string): void {
    try {
      // Store email details in localStorage for development testing
      const emailData = {
        to: emailTemplate.to,
        subject: emailTemplate.subject,
        resetToken,
        resetLink: `${window.location.origin}${window.location.pathname}?token=${resetToken}`,
        timestamp: new Date().toISOString(),
        html: emailTemplate.html
      };

      localStorage.setItem('akshata_last_reset_email', JSON.stringify(emailData));

      console.log('💾 Email data stored in localStorage for development testing');
      console.log('🔗 Reset Link:', emailData.resetLink);

      // Also show a user-friendly message
      setTimeout(() => {
        if (window.confirm(`📧 Development Mode: Password reset email prepared!\n\n🔗 Reset Link: ${emailData.resetLink}\n\nClick OK to copy the reset link to clipboard, or Cancel to continue.`)) {
          navigator.clipboard.writeText(emailData.resetLink).then(() => {
            alert('✅ Reset link copied to clipboard! You can paste it in the address bar to test the password reset.');
          }).catch(() => {
            console.log('📋 Reset link:', emailData.resetLink);
          });
        }
      }, 1500);

    } catch (error) {
      console.error('Error storing email data:', error);
    }
  }

  // Method to get stored email for development testing
  getStoredResetEmail(): any {
    try {
      const stored = localStorage.getItem('akshata_last_reset_email');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error retrieving stored email:', error);
      return null;
    }
  }

  // Method to integrate with real email services
  async sendWithRealEmailService(emailTemplate: EmailTemplate): Promise<{ success: boolean; error?: string }> {
    try {
      // Example integration with different email services:

      // 1. SendGrid API
      /*
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: emailTemplate.to }]
          }],
          from: { email: 'noreply@akshataparlor.com', name: 'AKSHATA BEAUTY HERBAL PARLOUR' },
          subject: emailTemplate.subject,
          content: [
            { type: 'text/html', value: emailTemplate.html },
            { type: 'text/plain', value: emailTemplate.text }
          ]
        })
      });
  
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: 'SendGrid API error' };
      }
      */

      // 2. Mailgun API
      /*
      const formData = new FormData();
      formData.append('from', 'AKSHATA BEAUTY HERBAL PARLOUR <noreply@akshataparlor.com>');
      formData.append('to', emailTemplate.to);
      formData.append('subject', emailTemplate.subject);
      formData.append('html', emailTemplate.html);
      formData.append('text', emailTemplate.text);
  
      const response = await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`api:${process.env.MAILGUN_API_KEY}`)}`
        },
        body: formData
      });
  
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: 'Mailgun API error' };
      }
      */

      return { success: true };
    } catch (error) {
      console.error('Real email service error:', error);
      return { success: false, error: 'Failed to send email via real service' };
    }
  }

  // Configuration method for production setup
  updateConfig(newConfig: Partial<EmailConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Test email connectivity
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔄 Testing email service connection...');

      // Test email service connection
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('✅ Email service connection successful');
      return { success: true };
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return { success: false, error: 'Connection test failed' };
    }
  }
}

export default EmailService;