const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

const categories = [
  'Password Management',
  'Authentication',
  'Device Security',
  'Data Protection',
  'Network Security',
  'Software Updates',
  'Email Security',
  'Physical Security',
  'Social Engineering'
];

const sampleQuestions = categories.map(category => ({
  complianceName: category,
  question: `Do you follow best practices for ${category.toLowerCase()}?`,
  userType: 'user',
  options: [
    { label: 'A', text: 'Yes', weight: 100 },
    { label: 'B', text: 'No', weight: 0 }
  ],
  weight: 10,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
}));

async function seedInitialQuestions() {
  try {
    const questionCount = await Question.countDocuments();
    if (questionCount === 0) {
      console.log('Seeding initial questions...');
      await Question.insertMany(sampleQuestions);
      console.log(`Seeded ${sampleQuestions.length} questions across all categories`);
    } else {
      console.log('Questions already exist, checking categories...');
      const existingCategories = await Question.distinct('complianceName');
      const missingCategories = categories.filter(cat => !existingCategories.includes(cat));
      if (missingCategories.length > 0) {
        console.log(`Seeding missing categories: ${missingCategories.join(', ')}`);
        const newQuestions = missingCategories.map(category => ({
          complianceName: category,
          question: `Do you follow best practices for ${category.toLowerCase()}?`,
          userType: 'user',
          options: [
            { label: 'A', text: 'Yes', weight: 100 },
            { label: 'B', text: 'No', weight: 0 }
          ],
          weight: 10,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }));
        await Question.insertMany(newQuestions);
        console.log(`Seeded ${newQuestions.length} additional questions`);
      }
    }
  } catch (err) {
    console.error('Error seeding questions:', err.message, err.stack);
  }
}

router.get('/seed', async (req, res) => {
  try {
    await seedInitialQuestions();
    res.json({ message: 'Questions seeded successfully' });
  } catch (err) {
    console.error('Error in /api/questions/seed:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
module.exports.seedInitialQuestions = seedInitialQuestions;