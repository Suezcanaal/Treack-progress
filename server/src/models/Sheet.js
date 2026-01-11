const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  topic: { type: String },
});

const sheetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String },
    type: { type: String, enum: ['default', 'custom'], default: 'custom' },
    problems: [problemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sheet', sheetSchema);
