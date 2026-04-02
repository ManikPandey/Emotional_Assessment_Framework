const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  registrationNumber: { 
    type: String, 
    required: true,
    trim: true 
  },
  scores: {
    selfAwareness: { type: Number, required: true },
    selfRegulation: { type: Number, required: true },
    motivation: { type: Number, required: true },
    empathy: { type: Number, required: true },
    socialSkills: { type: Number, required: true },
    effectiveness: { type: Number, required: true },
    totalScore: { type: Number, required: true }
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Assessment', assessmentSchema);