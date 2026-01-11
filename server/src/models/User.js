const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userProblemSchema = new mongoose.Schema(
  {
    sheet: { type: mongoose.Schema.Types.ObjectId, ref: 'Sheet', required: true },
    problemId: { type: mongoose.Schema.Types.ObjectId, required: true }, // subdocument _id from Sheet.problems
    status: { type: String, enum: ['solved', 'unsolved'], default: 'unsolved' },
    isStarred: { type: Boolean, default: false },
    notes: { type: String, default: '' },
    dateSolved: { type: Date },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otpCode: { type: String },
    otpExpires: { type: Date },
    solvedProblems: [userProblemSchema],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
