const Question = require('../models/Question');

const seedInitialQuestions = async () => {
  try {
    const questionCount = await Question.countDocuments();
    if (questionCount >= 10) {
      console.log(`Database already has ${questionCount} questions, skipping seeding.`);
      return;
    }

    console.log('Seeding initial questions...');
    const initialQuestions = [
      {
        userType: 'user',
        categories: [{ name: 'Password Management', weight: 8 }, { name: 'Data Privacy', weight: 6 }],
        question: 'How often do you change your passwords?',
        options: [
          { label: 'A', text: 'Every month', weight: 100, categoryImpacts: [{ name: 'Password Management', weight: 8 }, { name: 'Data Privacy', weight: 6 }] },
          { label: 'B', text: 'Every 3 months', weight: 75, categoryImpacts: [{ name: 'Password Management', weight: 6 }, { name: 'Data Privacy', weight: 4 }] },
          { label: 'C', text: 'Every 6 months', weight: 50, categoryImpacts: [{ name: 'Password Management', weight: 4 }, { name: 'Data Privacy', weight: 3 }] },
          { label: 'D', text: 'Never', weight: 0, categoryImpacts: [{ name: 'Password Management', weight: 0 }, { name: 'Data Privacy', weight: 0 }] },
        ],
        weight: 10,
      },
      {
        userType: 'user',
        categories: [{ name: 'Device Security', weight: 7 }, { name: 'Network Security', weight: 5 }],
        question: 'Do you use antivirus software on your devices?',
        options: [
          { label: 'A', text: 'Yes, regularly updated', weight: 100, categoryImpacts: [{ name: 'Device Security', weight: 7 }, { name: 'Network Security', weight: 5 }] },
          { label: 'B', text: 'Yes, but not updated', weight: 50, categoryImpacts: [{ name: 'Device Security', weight: 4 }, { name: 'Network Security', weight: 3 }] },
          { label: 'C', text: 'No', weight: 0, categoryImpacts: [{ name: 'Device Security', weight: 0 }, { name: 'Network Security', weight: 0 }] },
        ],
        weight: 8,
      },
      {
        userType: 'user',
        categories: [{ name: 'Data Privacy', weight: 6 }, { name: 'Authentication', weight: 7 }],
        question: 'Do you use two-factor authentication for your accounts?',
        options: [
          { label: 'A', text: 'Yes, for all accounts', weight: 100, categoryImpacts: [{ name: 'Data Privacy', weight: 6 }, { name: 'Authentication', weight: 7 }] },
          { label: 'B', text: 'Yes, for some accounts', weight: 50, categoryImpacts: [{ name: 'Data Privacy', weight: 3 }, { name: 'Authentication', weight: 4 }] },
          { label: 'C', text: 'No', weight: 0, categoryImpacts: [{ name: 'Data Privacy', weight: 0 }, { name: 'Authentication', weight: 0 }] },
        ],
        weight: 9,
      },
      {
        userType: 'user',
        categories: [{ name: 'Network Security', weight: 6 }, { name: 'Password Management', weight: 5 }],
        question: 'Do you use a VPN when connecting to public Wi-Fi?',
        options: [
          { label: 'A', text: 'Always', weight: 100, categoryImpacts: [{ name: 'Network Security', weight: 6 }, { name: 'Password Management', weight: 5 }] },
          { label: 'B', text: 'Sometimes', weight: 50, categoryImpacts: [{ name: 'Network Security', weight: 3 }, { name: 'Password Management', weight: 3 }] },
          { label: 'C', text: 'Never', weight: 0, categoryImpacts: [{ name: 'Network Security', weight: 0 }, { name: 'Password Management', weight: 0 }] },
        ],
        weight: 7,
      },
      {
        userType: 'user',
        categories: [{ name: 'Device Security', weight: 8 }, { name: 'Authentication', weight: 6 }],
        question: 'Do you lock your devices with a PIN or biometric authentication?',
        options: [
          { label: 'A', text: 'Yes, always', weight: 100, categoryImpacts: [{ name: 'Device Security', weight: 8 }, { name: 'Authentication', weight: 6 }] },
          { label: 'B', text: 'Sometimes', weight: 50, categoryImpacts: [{ name: 'Device Security', weight: 4 }, { name: 'Authentication', weight: 3 }] },
          { label: 'C', text: 'No', weight: 0, categoryImpacts: [{ name: 'Device Security', weight: 0 }, { name: 'Authentication', weight: 0 }] },
        ],
        weight: 8,
      },
      {
        userType: 'user',
        categories: [{ name: 'Data Privacy', weight: 7 }, { name: 'Network Security', weight: 5 }],
        question: 'Do you review app permissions before installing them?',
        options: [
          { label: 'A', text: 'Always', weight: 100, categoryImpacts: [{ name: 'Data Privacy', weight: 7 }, { name: 'Network Security', weight: 5 }] },
          { label: 'B', text: 'Sometimes', weight: 50, categoryImpacts: [{ name: 'Data Privacy', weight: 4 }, { name: 'Network Security', weight: 3 }] },
          { label: 'C', text: 'Never', weight: 0, categoryImpacts: [{ name: 'Data Privacy', weight: 0 }, { name: 'Network Security', weight: 0 }] },
        ],
        weight: 7,
      },
      {
        userType: 'user',
        categories: [{ name: 'Password Management', weight: 6 }, { name: 'Authentication', weight: 5 }],
        question: 'Do you use a password manager to generate and store passwords?',
        options: [
          { label: 'A', text: 'Yes', weight: 100, categoryImpacts: [{ name: 'Password Management', weight: 6 }, { name: 'Authentication', weight: 5 }] },
          { label: 'B', text: 'No, but I use unique passwords', weight: 50, categoryImpacts: [{ name: 'Password Management', weight: 3 }, { name: 'Authentication', weight: 3 }] },
          { label: 'C', text: 'No, I reuse passwords', weight: 0, categoryImpacts: [{ name: 'Password Management', weight: 0 }, { name: 'Authentication', weight: 0 }] },
        ],
        weight: 8,
      },
      {
        userType: 'user',
        categories: [{ name: 'Device Security', weight: 7 }, { name: 'Data Privacy', weight: 6 }],
        question: 'Do you keep your device’s software up to date?',
        options: [
          { label: 'A', text: 'Always', weight: 100, categoryImpacts: [{ name: 'Device Security', weight: 7 }, { name: 'Data Privacy', weight: 6 }] },
          { label: 'B', text: 'Sometimes', weight: 50, categoryImpacts: [{ name: 'Device Security', weight: 4 }, { name: 'Data Privacy', weight: 3 }] },
          { label: 'C', text: 'No', weight: 0, categoryImpacts: [{ name: 'Device Security', weight: 0 }, { name: 'Data Privacy', weight: 0 }] },
        ],
        weight: 8,
      },
      {
        userType: 'user',
        categories: [{ name: 'Network Security', weight: 6 }, { name: 'Authentication', weight: 5 }],
        question: 'Do you avoid clicking on suspicious email links or attachments?',
        options: [
          { label: 'A', text: 'Always', weight: 100, categoryImpacts: [{ name: 'Network Security', weight: 6 }, { name: 'Authentication', weight: 5 }] },
          { label: 'B', text: 'Sometimes', weight: 50, categoryImpacts: [{ name: 'Network Security', weight: 3 }, { name: 'Authentication', weight: 3 }] },
          { label: 'C', text: 'Never', weight: 0, categoryImpacts: [{ name: 'Network Security', weight: 0 }, { name: 'Authentication', weight: 0 }] },
        ],
        weight: 7,
      },
      {
        userType: 'user',
        categories: [{ name: 'Data Privacy', weight: 7 }, { name: 'Password Management', weight: 6 }],
        question: 'Do you use encrypted messaging apps for sensitive communications?',
        options: [
          { label: 'A', text: 'Always', weight: 100, categoryImpacts: [{ name: 'Data Privacy', weight: 7 }, { name: 'Password Management', weight: 6 }] },
          { label: 'B', text: 'Sometimes', weight: 50, categoryImpacts: [{ name: 'Data Privacy', weight: 4 }, { name: 'Password Management', weight: 3 }] },
          { label: 'C', text: 'Never', weight: 0, categoryImpacts: [{ name: 'Data Privacy', weight: 0 }, { name: 'Password Management', weight: 0 }] },
        ],
        weight: 8,
      },
    ];

    await Question.deleteMany({});
    await Question.insertMany(initialQuestions.slice(0, 10));
    console.log('Seeded 10 questions successfully');
  } catch (error) {
    console.error('Error seeding questions:', error);
    throw error;
  }
};

module.exports = { seedInitialQuestions };