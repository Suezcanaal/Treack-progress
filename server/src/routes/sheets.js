const express = require('express');
const jwt = require('jsonwebtoken');
const Sheet = require('../models/Sheet');
const User = require('../models/User');

const router = express.Router();

function auth(req, res, next) {
  // Support token via Authorization header: Bearer <token>
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Get all sheets (default + user's custom) with progress
router.get('/', auth, async (req, res) => {
  try {
    const [sheets, user] = await Promise.all([
      Sheet.find({}),
      User.findById(req.userId),
    ]);

    // Build counts of solved problems per sheet from the new structure
    const solvedCountBySheet = new Map();
    for (const entry of user.solvedProblems || []) {
      if (entry.status === 'solved') {
        const key = String(entry.sheet);
        solvedCountBySheet.set(key, (solvedCountBySheet.get(key) || 0) + 1);
      }
    }

    const result = sheets.map((s) => {
      const total = s.problems.length || 0;
      const done = solvedCountBySheet.get(String(s._id)) || 0;
      const progress = total ? Math.round((done / total) * 100) : 0;
      return {
        _id: s._id,
        title: s.title,
        description: s.description,
        type: s.type,
        problemsCount: total,
        progress,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create custom sheet
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, problems } = req.body;
    const sheet = await Sheet.create({ title, description, type: 'custom', problems: problems || [] });
    res.status(201).json(sheet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get sheet detail with problems and user-specific meta (solved/starred/notes)
router.get('/:id', auth, async (req, res) => {
  try {
    const sheet = await Sheet.findById(req.params.id);
    if (!sheet) return res.status(404).json({ message: 'Not found' });

    const user = await User.findById(req.userId);
    const mapByProblemId = new Map();
    for (const up of user.solvedProblems || []) {
      if (String(up.sheet) === String(sheet._id)) {
        mapByProblemId.set(String(up.problemId), up);
      }
    }

    const problems = sheet.problems.map((p, idx) => {
      const meta = mapByProblemId.get(String(p._id));
      return {
        index: idx,
        _id: p._id,
        title: p.title,
        link: p.link,
        difficulty: p.difficulty,
        topic: p.topic,
        solved: meta ? meta.status === 'solved' : false,
        isStarred: meta ? !!meta.isStarred : false,
        notes: meta ? (meta.notes || '') : '',
      };
    });

    res.json({ _id: sheet._id, title: sheet.title, description: sheet.description, type: sheet.type, problems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update problem meta: solved/star/note
router.post('/:id/toggle', auth, async (req, res) => {
  try {
    const { problemIndex, solved, star, note } = req.body; // optional fields
    const sheet = await Sheet.findById(req.params.id);
    if (!sheet) return res.status(404).json({ message: 'Not found' });
    const problem = sheet.problems[problemIndex];
    if (!problem) return res.status(400).json({ message: 'Invalid problem index' });

    const user = await User.findById(req.userId);
    if (!user.solvedProblems) user.solvedProblems = [];

    let entry = user.solvedProblems.find(
      (e) => String(e.sheet) === String(sheet._id) && String(e.problemId) === String(problem._id)
    );
    if (!entry) {
      entry = { sheet: sheet._id, problemId: problem._id, status: 'unsolved', isStarred: false, notes: '' };
      user.solvedProblems.push(entry);
    }

    if (typeof solved === 'boolean') {
      entry.status = solved ? 'solved' : 'unsolved';
      entry.dateSolved = solved ? new Date() : undefined;
    }
    if (typeof star === 'boolean') entry.isStarred = star;
    if (typeof note === 'string') entry.notes = note;

    await user.save();
    res.json({ message: 'Updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update custom sheet
router.put('/:id', auth, async (req, res) => {
  try {
    const updates = req.body;
    const sheet = await Sheet.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(sheet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete custom sheet
router.delete('/:id', auth, async (req, res) => {
  try {
    await Sheet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
