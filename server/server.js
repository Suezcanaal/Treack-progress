require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./src/routes/auth');
const sheetRoutes = require('./src/routes/sheets');
const Sheet = require('./src/models/Sheet');
const User = require('./src/models/User');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  'http://localhost:5173',
  'https://treack-progress.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sheets', sheetRoutes);

// Analytics for dashboard heatmap: counts per day for last 365 days
app.get('/api/activity', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'No token' });
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).lean();
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - 364);
    const counts = {};
    for (const item of user.solvedProblems || []) {
      if (item.dateSolved) {
        const d = new Date(item.dateSolved);
        if (d >= start && d <= now && item.status === 'solved') {
          const key = d.toISOString().slice(0, 10);
          counts[key] = (counts[key] || 0) + 1;
        }
      }
    }
    res.json({ start: start.toISOString().slice(0,10), end: now.toISOString().slice(0,10), counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

async function seedDefaultSheets() {
  const defaults = [
    {
      title: 'Blind 75',
      description: 'Curated list of 75 essential LeetCode problems',
      type: 'default',
      problems: [
        { title: 'Two Sum', link: 'https://leetcode.com/problems/two-sum/', difficulty: 'Easy', topic: 'Array' },
        { title: 'Best Time to Buy and Sell Stock', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', difficulty: 'Easy', topic: 'Array' },
        { title: 'Valid Parentheses', link: 'https://leetcode.com/problems/valid-parentheses/', difficulty: 'Easy', topic: 'Stack' },
      ],
    },
    {
      title: 'Striver SDE Sheet',
      description: 'Striver’s SDE Sheet for interview preparation',
      type: 'default',
      problems: [
        { title: 'Set Matrix Zeroes', link: 'https://leetcode.com/problems/set-matrix-zeroes/', difficulty: 'Medium', topic: 'Array' },
        { title: 'Merge Intervals', link: 'https://leetcode.com/problems/merge-intervals/', difficulty: 'Medium', topic: 'Intervals' },
      ],
    },
    {
      title: 'Java Revision',
      description: 'Important Java DSA problems for quick revision',
      type: 'default',
      problems: [
        { title: 'Reverse Linked List', link: 'https://leetcode.com/problems/reverse-linked-list/', difficulty: 'Easy', topic: 'Linked List' },
        { title: 'LRU Cache', link: 'https://leetcode.com/problems/lru-cache/', difficulty: 'Medium', topic: 'Design' },
      ],
    },
  ];

  for (const sheet of defaults) {
    const exists = await Sheet.findOne({ title: sheet.title, type: 'default' });
    if (!exists) {
      await Sheet.create(sheet);
      console.log(`Seeded default sheet: ${sheet.title}`);
    }
  }
}

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('MongoDB connected');

    await seedDefaultSheets();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Server start error:', err.message);
    process.exit(1);
  }
}

start();
