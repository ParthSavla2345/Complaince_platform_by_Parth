const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  complianceName: { type: String, required: true },
  question: { type: String, required: true },
  userType: { type: String, enum: ['user', 'company', 'both'], required: true },
  options: [{
    label: { type: String, required: true },
    text: { type: String, required: true },
    weight: { type: Number, required: true }
  }],
  weight: { type: Number, default: 10 },
  isActive: { type: Boolean, default: true },
  responses: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true // Automatically manages createdAt and updatedAt
});

module.exports = mongoose.model('Question', questionSchema);