const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

// @route   POST /api/submit
// @desc    Submit a new EI assessment
router.post('/submit', async (req, res) => {
  try {
    const { name, registrationNumber, scores } = req.body;

    // Basic validation to ensure no missing data
    if (!name || !registrationNumber || !scores) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const newAssessment = new Assessment({
      name,
      registrationNumber,
      scores
    });

    await newAssessment.save();
    res.status(201).json({ message: 'Assessment saved successfully', data: newAssessment });
  } catch (error) {
    console.error('Error saving assessment:', error);
    res.status(500).json({ error: 'Failed to save assessment data' });
  }
});

// @route   GET /api/analytics
// @desc    Fetch aggregate data for comparison charts
router.get('/analytics', async (req, res) => {
  try {
    // Calculate the average scores across all documents in the database
    const aggregates = await Assessment.aggregate([
      {
        $group: {
          _id: null,
          avgSelfAwareness: { $avg: "$scores.selfAwareness" },
          avgSelfRegulation: { $avg: "$scores.selfRegulation" },
          avgMotivation: { $avg: "$scores.motivation" },
          avgEmpathy: { $avg: "$scores.empathy" },
          avgSocialSkills: { $avg: "$scores.socialSkills" },
          avgEffectiveness: { $avg: "$scores.effectiveness" },
          avgTotal: { $avg: "$scores.totalScore" },
          totalParticipants: { $sum: 1 }
        }
      }
    ]);

    // Handle case where database has no submissions yet
    if (aggregates.length === 0) {
      return res.json({
        avgSelfAwareness: 0,
        avgSelfRegulation: 0,
        avgMotivation: 0,
        avgEmpathy: 0,
        avgSocialSkills: 0,
        avgEffectiveness: 0,
        avgTotal: 0,
        totalParticipants: 0
      });
    }

    // Remove the unused _id field from the response object
    const { _id, ...cleanData } = aggregates[0];
    res.json(cleanData);
    
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;