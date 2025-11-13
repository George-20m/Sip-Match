import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

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

export default router;