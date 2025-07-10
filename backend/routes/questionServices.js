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

const sampleQuestions = [
  {
    complianceName: 'Password Management',
    question: 'Do you use a password manager to generate and store unique passwords?',
    userType: 'user',
    options: [
      { label: 'A', text: 'Yes, I use a password manager', weight: 100 },
      { label: 'B', text: 'No, I create and remember passwords manually', weight: 0 }
    ],
    weight: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    complianceName: 'Authentication',
    question: 'Have you enabled multi-factor authentication (MFA) on your accounts?',
    userType: 'user',
    options: [
      { label: 'A', text: 'Yes, MFA is enabled on all sensitive accounts', weight: 100 },
      { label: 'B', text: 'No, I use only passwords', weight: 0 }
    ],
    weight: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    complianceName: 'Device Security',
    question: 'Do you lock your devices with a strong password or biometric authentication?',
    userType: 'user',
    options: [
      { label: 'A', text: 'Yes, all my devices are secured', weight: 100 },
      { label: 'B', text: 'No, my devices are not locked', weight: 0 }
    ],
    weight: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    complianceName: 'Data Protection',
    question: 'Do you regularly back up your data to a secure location?',
    userType: 'user',
    options: [
      { label: 'A', text: 'Yes, I have automated encrypted backups', weight: 100 },
      { label: 'B', text: 'No, I don’t back up my data', weight: 0 }
    ],
    weight: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    complianceName: 'Network Security',
    question: 'Do you use a VPN when connecting to public Wi-Fi networks?',
    userType: 'user',
    options: [
      { label: 'A', text: 'Yes, I always use a VPN on public Wi-Fi', weight: 100 },
      { label: 'B', text: 'No, I connect directly to public Wi-Fi', weight: 0 }
    ],
    weight: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    complianceName: 'Software Updates',
    question: 'Do you keep your software and operating systems up to date?',
    userType: 'user',
    options: [
      { label: 'A', text: 'Yes, I enable automatic updates', weight: 100 },
      { label: 'B', text: 'No, I update manually or not at all', weight: 0 }
    ],
    weight: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    complianceName: 'Email Security',
    question: 'Do you verify the sender before clicking links in emails?',
    userType: 'user',
    options: [
      { label: 'A', text: 'Yes, I always verify email senders', weight: 100 },
      { label: 'B', text: 'No, I sometimes click links without checking', weight: 0 }
    ],
    weight: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    complianceName: 'Physical Security',
    question: 'Do you keep your devices in a secure location when not in use?',
    userType: 'user',
    options: [
      { label: 'A', text: 'Yes, my devices are stored securely', weight: 100 },
      { label: 'B', text: 'No, my devices are left unattended', weight: 0 }
    ],
    weight: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    complianceName: 'Social Engineering',
    question: 'Do you verify requests for sensitive information through official channels?',
    userType: 'user',
    options: [
      { label: 'A', text: 'Yes, I always verify requests', weight: 100 },
      { label: 'B', text: 'No, I sometimes share information without verifying', weight: 0 }
    ],
    weight: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    complianceName: 'Password Management',
    question: 'Do you use unique passwords for each of your accounts?',
    userType: 'user',
    options: [
      { label: 'A', text: 'Yes, all my passwords are unique', weight: 100 },
      { label: 'B', text: 'No, I reuse passwords across accounts', weight: 0 }
    ],
    weight: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

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