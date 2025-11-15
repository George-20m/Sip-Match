// backend\src\routes\authRoutes.js
import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto';

const router = express.Router();
const generateToken = (userId) => {
  // Implement token generation logic (e.g., JWT)
  return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "15d"});
};

router.post("/register", async (req, res) => {
  // Handle user registration
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

    // check if user already exists in the database

    const existingEmail = await User.findOne({ email });
    if(existingEmail){
      return res.status(400).json({message: "This email is already registered"});
    }

    const user = new User({
        username,
        email,
        password
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

router.post("/login", async (req, res) => {
  // Handle user login
  try {
    const {email, password} = req.body;

    if(!email || !password){
      return res.status(400).json({message: "All fields are required"});
    }

    // check if user exists
    const user = await User.findOne({ email });
    if(!user){
      return res.status(400).json({message: "Invalid email or password"});
    }

    // check if password is correct
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
      return res.status(400).json({message: "Invalid email or password"});
    }

    // generate token
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

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      // Don't reveal if user exists for security
      return res.status(200).json({ 
        message: "If that email exists, a reset code has been sent." 
      });
    }

    // Generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save code to database
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpiry = resetCodeExpiry;
    await user.save();

    // Log code (in production, send via email)
    console.log(`📧 Password reset code for ${email}: ${resetCode}`);
    console.log(`⏰ Code expires in 10 minutes`);

    res.status(200).json({ 
      message: "If that email exists, a reset code has been sent.",
      // ⚠️ REMOVE THIS IN PRODUCTION! Only for testing:
      resetCode: resetCode 
    });

  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Server error during password reset" });
  }
});

// Reset Password - Verify Code and Update Password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    // Validation
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Find user with valid code
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

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    console.log(`✅ Password reset successful for: ${email}`);

    res.status(200).json({ 
      message: "Password reset successful" 
    });

  } catch (error) {
    console.error("Error in reset password:", error);
    res.status(500).json({ message: "Server error during password reset" });
  }
});

export default router;