const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  complianceName: { type: String, required: true },
  question: { type: String, required: true },
  options: [{
    label: { type: String, required: true },
    text: { type: String, required: true },
    weight: { type: Number, required: true }
  }],
  weight: { type: Number, required: true },
  userType: { type: String, enum: ['user', 'company', 'both'], required: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: false },
  responses: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);