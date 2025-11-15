import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail, sendPasswordResetEmail } from "../config/emailConfig.js";

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "15d"});
};

// Step 1: Send verification code (doesn't create user yet)
router.post("/send-verification", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    if (username.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters long" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser && existingUser.isEmailVerified) {
      return res.status(400).json({ message: "This email is already registered" });
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // If user exists but not verified, update their info
    if (existingUser) {
      existingUser.username = username;
      existingUser.password = password; // Will be hashed by pre-save hook
      existingUser.emailVerificationCode = verificationCode;
      existingUser.emailVerificationExpiry = verificationExpiry;
      await existingUser.save();
    } else {
      // Create temporary unverified user
      const tempUser = new User({
        username,
        email: email.toLowerCase().trim(),
        password, // Will be hashed by pre-save hook
        isEmailVerified: false,
        emailVerificationCode: verificationCode,
        emailVerificationExpiry: verificationExpiry,
      });
      await tempUser.save();
    }

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode, username);
      console.log(`✅ Verification email sent to: ${email}`);
      
      res.status(200).json({ 
        message: "Verification code sent to your email",
        email: email.toLowerCase().trim()
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return res.status(500).json({ 
        message: "Failed to send verification email. Please try again." 
      });
    }

  } catch (error) {
    console.error("Error in send-verification:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Step 2: Verify code and complete registration
router.post("/verify-email", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    // Find user with valid verification code
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      emailVerificationCode: code.trim(),
      emailVerificationExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid or expired verification code" 
      });
    }

    // Mark email as verified and clear verification fields
    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save();

    // Generate token for automatic login
    const token = generateToken(user._id);

    console.log(`✅ Email verified successfully for: ${email}`);

    res.status(200).json({
      message: "Email verified successfully",
      token,
      user: {
        userId: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Error in verify-email:", error);
    res.status(500).json({ message: "Server error during verification" });
  }
});

// Original register route (keeping for backward compatibility or direct registration)
router.post("/register", async (req, res) => {
  try {
    const {username, email, password} = req.body;

    if(!username || !email || !password){
      return res.status(400).json({message: "All fields are required"});
    }

    if (password.length < 6){
      return res.status(400).json({message: "Password must be at least 6 characters long"});
    }

    if(username.length < 3){
      return res.status(400).json({message: "Username must be at least 3 characters long"});
    }

    const existingEmail = await User.findOne({ email });
    if(existingEmail){
      return res.status(400).json({message: "This email is already registered"});
    }

    const user = new User({
        username,
        email,
        password,
        isEmailVerified: true // For direct registration without verification
    })

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
        token, 
        user: {
            userId: user._id,
            username: user.username,
            email: user.email
        }
    });

  } catch (error){
    console.error("Error during registration:", error);
    res.status(500).json({message: "Server error during registration"});
  }
});

// Login - only allow verified users
router.post("/login", async (req, res) => {
  try {
    const {email, password} = req.body;

    if(!email || !password){
      return res.status(400).json({message: "All fields are required"});
    }

    const user = await User.findOne({ email });
    if(!user){
      return res.status(400).json({message: "Invalid email or password"});
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(400).json({ 
        message: "Please verify your email before logging in" 
      });
    }

    const isMatch = await user.matchPassword(password);
    if(!isMatch){
      return res.status(400).json({message: "Invalid email or password"});
    }

    const token = generateToken(user._id);

    res.status(200).json({
        token,
        user: {
          userId: user._id,
          username: user.username,
          email: user.email
        }
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({message: "Server error during login"});
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return res.status(200).json({ 
        message: "If that email exists, a reset code has been sent." 
      });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpiry = Date.now() + 10 * 60 * 1000;

    user.resetPasswordCode = resetCode;
    user.resetPasswordExpiry = resetCodeExpiry;
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, resetCode, user.username);
      console.log(`✅ Password reset email sent to: ${user.email}`);
      
      res.status(200).json({ 
        message: "Password reset code has been sent to your email."
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      user.resetPasswordCode = undefined;
      user.resetPasswordExpiry = undefined;
      await user.save();
      
      return res.status(500).json({ 
        message: "Failed to send reset email. Please try again." 
      });
    }

  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Server error during password reset" });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    const user = await User.findOne({ 
      email: email.toLowerCase().trim(),
      resetPasswordCode: code.trim(),
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid or expired reset code" 
      });
    }

    user.password = newPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    console.log(`✅ Password reset successful for: ${email}`);

    res.status(200).json({ 
      message: "Password reset successful. You can now login with your new password." 
    });

  } catch (error) {
    console.error("Error in reset password:", error);
    res.status(500).json({ message: "Server error during password reset" });
  }
});

export default router;