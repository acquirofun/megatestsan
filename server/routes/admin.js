

// server/routes/admin.js
const express = require('express');
const router = express.Router();
const AdminModel = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Environment variables should be used for sensitive values
const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret-key";
// const COOKIE_OPTIONS = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === 'production',
//   sameSite: 'strict',
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours
// };

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: false, // Set to false in development
    sameSite: 'lax', // 'lax' is more permissive than 'strict'
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  };

// const COOKIE_OPTIONS = {
//   httpOnly: true,
//   secure: true,
//   sameSite: 'lax',
//   maxAge: 24 * 60 * 60 * 1000,
//   domain: '76e0ad2fa124.ngrok.app'  // Update this with your current ngrok URL
// };



const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await AdminModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);
    const user = await AdminModel.create({ name, email, password: hash });

    // Don't send password in response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    res.status(201).json(userResponse);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Input validation
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
  
      const user = await AdminModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      res.cookie("token", token, COOKIE_OPTIONS);
      res.json({ message: "Success", email: user.email }); // Include any user data you want to send back
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: "Logged out successfully" });
});

router.get('/home', verifyUser, (req, res) => {
    try {
      // Since verifyUser middleware already checked the token,
      // we can safely send the user data
      res.json({
        message: "Success",
        email: req.user.email
      });
    } catch (err) {
      res.status(401).json({ error: "Authentication failed" });
    }
  });

module.exports = router;
