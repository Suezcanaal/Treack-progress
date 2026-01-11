const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const router = express.Router();

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Signup - send OTP
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const otp = generateOTP();
    const user = await User.create({ email, password, otpCode: otp, otpExpires: new Date(Date.now() + 10 * 60 * 1000) });

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `DSA Tracker <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your DSA Tracker verification code',
      html: `<div style="font-family:system-ui,Segoe UI,Roboto;">
              <h2>Verify your email</h2>
              <p>Your OTP code is:</p>
              <div style="font-size:28px;font-weight:700;letter-spacing:6px;">${otp}</div>
              <p>This code expires in 10 minutes.</p>
            </div>`,
    });

    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP
router.post('/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email' });

    if (user.isVerified) return res.json({ message: 'Already verified' });

    if (!user.otpCode || user.otpCode !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (!user.otpExpires || user.otpExpires < new Date()) return res.status(400).json({ message: 'OTP expired' });

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = signToken(user);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.isVerified) return res.status(403).json({ message: 'Email not verified' });

    const token = signToken(user);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
