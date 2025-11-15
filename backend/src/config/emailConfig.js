// backend/src/config/emailConfig.js
import nodemailer from 'nodemailer';

// Send password reset email
export const sendPasswordResetEmail = async (email, resetCode, username) => {
  try {
    // Create transporter directly
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Sip&Match" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Code - Sip&Match',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #FFF8E7;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 15px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
              padding: 30px;
              text-align: center;
            }
            .logo {
              color: white;
              font-size: 28px;
              font-weight: bold;
              margin: 0;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 18px;
              color: #3E2723;
              margin-bottom: 20px;
            }
            .message {
              color: #5D4037;
              line-height: 1.6;
              margin-bottom: 30px;
            }
            .code-container {
              background-color: #F5E6D3;
              border: 2px dashed #8B4513;
              border-radius: 10px;
              padding: 25px;
              text-align: center;
              margin: 30px 0;
            }
            .code {
              font-size: 36px;
              font-weight: bold;
              color: #8B4513;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
            }
            .code-label {
              color: #8D6E63;
              font-size: 14px;
              margin-top: 10px;
            }
            .warning {
              background-color: #FFF3E0;
              border-left: 4px solid #FF9800;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .warning-text {
              color: #E65100;
              font-size: 14px;
              margin: 0;
            }
            .footer {
              background-color: #F5E6D3;
              padding: 20px;
              text-align: center;
              color: #8D6E63;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo">☕ Sip&Match</h1>
            </div>
            
            <div class="content">
              <p class="greeting">Hi ${username || 'there'}! 👋</p>
              
              <p class="message">
                We received a request to reset your password. Use the code below to complete your password reset:
              </p>
              
              <div class="code-container">
                <div class="code">${resetCode}</div>
                <div class="code-label">Your Reset Code</div>
              </div>
              
              <p class="message">
                Enter this code in the Sip&Match app to create your new password.
              </p>
              
              <div class="warning">
                <p class="warning-text">
                  ⚠️ This code will expire in 10 minutes for security reasons.
                </p>
              </div>
              
              <p class="message">
                If you didn't request this password reset, please ignore this email or contact support if you have concerns.
              </p>
            </div>
            
            <div class="footer">
              <p>This email was sent by Sip&Match</p>
              <p>Your personalized drink companion ☕</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hi ${username || 'there'}!
        
        Your password reset code is: ${resetCode}
        
        This code will expire in 10 minutes.
        
        If you didn't request this, please ignore this email.
        
        - Sip&Match Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};