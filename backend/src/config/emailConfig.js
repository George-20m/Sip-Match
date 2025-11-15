import nodemailer from 'nodemailer';

// Send email verification OTP
export const sendVerificationEmail = async (email, verificationCode, username) => {
  try {
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
      subject: 'Verify Your Email - Sip&Match',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">☕ Sip&Match</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 18px; color: #3E2723; margin-bottom: 20px;">Welcome ${username}! 🎉</p>
            <p style="color: #5D4037; line-height: 1.6;">Thank you for signing up with Sip&Match! To complete your registration, please verify your email address using the code below:</p>
            <div style="background-color: #F5E6D3; border: 2px dashed #8B4513; border-radius: 10px; padding: 25px; text-align: center; margin: 30px 0;">
              <div style="font-size: 36px; font-weight: bold; color: #8B4513; letter-spacing: 8px; font-family: 'Courier New', monospace;">${verificationCode}</div>
              <div style="color: #8D6E63; font-size: 14px; margin-top: 10px;">Your Verification Code</div>
            </div>
            <p style="color: #5D4037; line-height: 1.6;">Enter this code in the Sip&Match app to activate your account.</p>
            <div style="background-color: #FFF3E0; border-left: 4px solid #FF9800; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="color: #E65100; font-size: 14px; margin: 0;">⚠️ This code will expire in 10 minutes for security reasons.</p>
            </div>
            <p style="color: #5D4037; line-height: 1.6;">If you didn't create an account with Sip&Match, please ignore this email.</p>
          </div>
          <div style="background-color: #F5E6D3; padding: 20px; text-align: center; color: #8D6E63; font-size: 12px;">
            <p style="margin: 5px 0;">This email was sent by Sip&Match</p>
            <p style="margin: 5px 0;">Your personalized drink companion ☕</p>
          </div>
        </div>
      `,
      text: `Welcome ${username}! Your email verification code is: ${verificationCode}. This code will expire in 10 minutes. If you didn't create an account, please ignore this email. - Sip&Match Team`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw error;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetCode, username) => {
  try {
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">☕ Sip&Match</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 18px; color: #3E2723; margin-bottom: 20px;">Hi ${username || 'there'}! 👋</p>
            <p style="color: #5D4037; line-height: 1.6;">We received a request to reset your password. Use the code below to complete your password reset:</p>
            <div style="background-color: #F5E6D3; border: 2px dashed #8B4513; border-radius: 10px; padding: 25px; text-align: center; margin: 30px 0;">
              <div style="font-size: 36px; font-weight: bold; color: #8B4513; letter-spacing: 8px; font-family: 'Courier New', monospace;">${resetCode}</div>
              <div style="color: #8D6E63; font-size: 14px; margin-top: 10px;">Your Reset Code</div>
            </div>
            <p style="color: #5D4037; line-height: 1.6;">Enter this code in the Sip&Match app to create your new password.</p>
            <div style="background-color: #FFF3E0; border-left: 4px solid #FF9800; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="color: #E65100; font-size: 14px; margin: 0;">⚠️ This code will expire in 10 minutes for security reasons.</p>
            </div>
            <p style="color: #5D4037; line-height: 1.6;">If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
          <div style="background-color: #F5E6D3; padding: 20px; text-align: center; color: #8D6E63; font-size: 12px;">
            <p style="margin: 5px 0;">This email was sent by Sip&Match</p>
            <p style="margin: 5px 0;">Your personalized drink companion ☕</p>
          </div>
        </div>
      `,
      text: `Hi ${username || 'there'}! Your password reset code is: ${resetCode}. This code will expire in 10 minutes. If you didn't request this, please ignore this email. - Sip&Match Team`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw error;
  }
};