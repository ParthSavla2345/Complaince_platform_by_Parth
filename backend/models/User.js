const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  questionHistory: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    questionText: String,
    complianceName: String,
    selectedOption: String,
    isCorrect: Boolean,
    questionWeight: Number,
    scoreEarned: Number,
    answeredAt: Date,
    attemptNumber: Number
  }],
  categoryScores: [{
    complianceName: String,
    totalScored: Number,
    totalWeighted: Number,
    percentageScore: Number,
    questionsAnswered: Number,
    lastActivity: Date,
    attemptNumber: Number
  }],
  totalScore: { type: Number, default: 0 },
  totalPossibleScore: { type: Number, default: 0 },
  overallPercentage: { type: Number, default: 0 },
  lastActivity: Date,
  assessmentHistory: [{
    overallPercentage: Number,
    completedAt: Date,
    attemptNumber: Number,
    userName: String
  }],
  assessmentAttempts: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);