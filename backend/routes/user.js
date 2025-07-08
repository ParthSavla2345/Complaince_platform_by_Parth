const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Question = require('../models/Question');
const mongoose = require('mongoose');

router.post('/submit', async (req, res) => {
  const { userId, questionId, selectedOption, isLastQuestion, attemptNumber } = req.body;

  try {
    console.log('Received submit request:', { userId, questionId, selectedOption, isLastQuestion, attemptNumber });

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      console.log(`Invalid questionId format: ${questionId}`);
      return res.status(400).json({ error: 'Invalid questionId format' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      console.log(`Question not found: ${questionId}`);
      return res.status(404).json({ error: 'Question not found' });
    }

    const option = question.options.find(opt => opt.label === selectedOption);
    if (!option) {
      console.log(`Invalid option: ${selectedOption} for question: ${questionId}`);
      return res.status(400).json({ error: 'Invalid option selected' });
    }

    let user = await User.findOne({ userId });
    if (!user) {
      console.log(`User not found: ${userId}`);
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.assessmentAttempts >= 10 && !isLastQuestion) {
      console.log(`User ${userId} has reached the maximum of 10 assessment attempts`);
      return res.status(403).json({ error: 'Maximum assessment attempts (10) reached' });
    }

    const currentAttempt = attemptNumber || user.assessmentAttempts + 1;

    // Reset for new attempt
    if (!attemptNumber || !user.questionHistory.some(h => h.attemptNumber === currentAttempt)) {
      user.questionHistory = user.questionHistory.filter(h => h.attemptNumber !== currentAttempt);
      user.categoryScores = user.categoryScores.filter(cs => cs.attemptNumber !== currentAttempt);
      user.totalScore = 0;
      user.totalPossibleScore = 0;
      user.overallPercentage = 0;
      await user.save();
      console.log(`Started new attempt ${currentAttempt} for user: ${userId}`);
    }

    const existingAnswer = user.questionHistory.find(
      history => history.questionId.toString() === questionId && history.attemptNumber === currentAttempt
    );
    if (existingAnswer) {
      console.log(`Question already answered: ${questionId} by user: ${userId} for attempt: ${currentAttempt}`);
      return res.status(400).json({ error: 'Question already answered for this attempt' });
    }

    const scoreEarned = Math.min(option.weight, 100);

    user.questionHistory.push({
      questionId,
      questionText: question.question,
      complianceName: question.complianceName,
      selectedOption,
      isCorrect: option.weight === 100,
      questionWeight: question.weight,
      scoreEarned,
      answeredAt: new Date(),
      attemptNumber: currentAttempt
    });

    let categoryScore = user.categoryScores.find(
      cs => cs.complianceName === question.complianceName && cs.attemptNumber === currentAttempt
    );
    if (!categoryScore) {
      categoryScore = {
        complianceName: question.complianceName,
        totalScored: 0,
        totalWeighted: 0,
        percentageScore: 0,
        questionsAnswered: 0,
        lastActivity: new Date(),
        attemptNumber: currentAttempt
      };
      user.categoryScores.push(categoryScore);
    }

    categoryScore.totalScored += scoreEarned;
    categoryScore.totalWeighted += question.weight;
    categoryScore.questionsAnswered += 1;
    categoryScore.percentageScore = Math.min(
      Number(((categoryScore.totalScored / categoryScore.totalWeighted) * 100).toFixed(2)),
      100
    );
    categoryScore.lastActivity = new Date();

    // Initialize all categories for the attempt
    const allCategories = [
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
    for (const category of allCategories) {
      if (!user.categoryScores.some(cs => cs.complianceName === category && cs.attemptNumber === currentAttempt)) {
        user.categoryScores.push({
          complianceName: category,
          totalScored: 0,
          totalWeighted: 0,
          percentageScore: 0,
          questionsAnswered: 0,
          lastActivity: new Date(),
          attemptNumber: currentAttempt
        });
      }
    }

    // Calculate total score for the current attempt
    const attemptCategories = user.categoryScores.filter(cs => cs.attemptNumber === currentAttempt);
    user.totalScore = attemptCategories.reduce((sum, cs) => sum + cs.totalScored, 0);
    user.totalPossibleScore = attemptCategories.reduce((sum, cs) => sum + cs.totalWeighted, 0);
    user.overallPercentage = user.totalPossibleScore > 0 
      ? Math.min(Number(((user.totalScore / user.totalPossibleScore) * 100).toFixed(2)), 100)
      : 0;
    user.lastActivity = new Date();

    if (isLastQuestion) {
      user.assessmentAttempts += 1;
      user.assessmentHistory.push({
        overallPercentage: user.overallPercentage,
        completedAt: new Date(),
        attemptNumber: currentAttempt,
        userName: user.name || 'User'
      });
    }

    await user.save();
    console.log(`Saved response for user: ${userId}, question: ${questionId}, option: ${selectedOption}, attempt: ${currentAttempt}, category: ${question.complianceName}, overallPercentage: ${user.overallPercentage}`);

    question.responses += 1;
    await question.save();

    res.json({
      isCorrect: option.weight === 100,
      scoreEarned,
      categoryScore: {
        complianceName: question.complianceName,
        totalScored: categoryScore.totalScored,
        totalWeighted: categoryScore.totalWeighted,
        percentageScore: categoryScore.percentageScore
      },
      overallPercentage: user.overallPercentage,
      attemptNumber: currentAttempt
    });
  } catch (err) {
    console.error('Error in /api/user/submit:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
});

router.get('/questions', async (req, res) => {
  try {
    const userType = req.query.userType || 'user';
    const userId = req.query.userId;
    console.log(`Fetching questions for userType: ${userType}, userId: ${userId}`);

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    if (!['user', 'company', 'both'].includes(userType)) {
      return res.status(400).json({ error: 'Invalid userType' });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      console.log(`User not found: ${userId}`);
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.assessmentAttempts >= 10) {
      console.log(`User ${userId} has reached the maximum of 10 assessment attempts`);
      return res.status(403).json({ error: 'Maximum assessment attempts (10) reached' });
    }

    const answeredQuestionIds = user.questionHistory
      .filter(h => h.attemptNumber === (user.assessmentAttempts + 1))
      .map(h => h.questionId.toString());

    const questions = await Question.aggregate([
      { $match: { 
        $or: [{ userType }, { userType: 'both' }], 
        isActive: true, 
        _id: { $nin: answeredQuestionIds.map(id => new mongoose.Types.ObjectId(id)) } 
      }},
      { $group: { _id: '$complianceName', question: { $first: '$$ROOT' } }},
      { $replaceRoot: { newRoot: '$question' } },
      { $limit: 9 }
    ]);

    console.log(`Returning ${questions.length} questions for userType: ${userType}`);
    if (questions.length === 0) {
      console.warn('No questions found for query:', { userType, isActive: true });
    }
    res.json(questions.map(q => ({
      id: q._id.toString(),
      category: q.complianceName,
      question: q.question,
      options: q.options,
      weight: q.weight
    })));
  } catch (err) {
    console.error('Error in /api/user/questions:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
});

router.get('/report', async (req, res) => {
  const { userId } = req.query;

  try {
    console.log(`Fetching report for userId: ${userId}`);
    const user = await User.findOne({ userId });
    if (!user) {
      console.log(`User not found: ${userId}`);
      return res.status(404).json({ error: 'User not found' });
    }

    const latestAttempt = Math.max(...user.assessmentHistory.map(h => h.attemptNumber), 0);

    const allCategories = [
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
    const categoryScores = Object.fromEntries(
      allCategories.map(category => {
        const cs = user.categoryScores.find(
          cs => cs.complianceName === category && cs.attemptNumber === latestAttempt
        );
        return [category, cs ? Number(cs.percentageScore.toFixed(2)) : 0];
      })
    );

    const attempts = user.assessmentHistory.map(attempt => ({
      attemptNumber: attempt.attemptNumber,
      overallPercentage: Number(attempt.overallPercentage.toFixed(2)),
      completedAt: attempt.completedAt,
      userName: attempt.userName || user.name || 'User'
    }));

    const attemptsWithChange = attempts.map((attempt, index) => {
      if (index === 0) {
        return { ...attempt, accuracyChange: 0 };
      }
      const prevAttempt = attempts[index - 1];
      const accuracyChange = Number((attempt.overallPercentage - prevAttempt.overallPercentage).toFixed(2));
      return { ...attempt, accuracyChange };
    });

    const lastAssessmentDate = user.assessmentHistory.length > 0
      ? new Date(Math.max(...user.assessmentHistory.map(h => new Date(h.completedAt))))
      : null;
    const lastAssessment = lastAssessmentDate
      ? `${Math.floor((new Date() - lastAssessmentDate) / (1000 * 60 * 60 * 24))} days ago`
      : 'No assessments completed';

    const totalAssessments = user.assessmentAttempts;

    const sortedAssessments = user.assessmentHistory.sort((a, b) => b.attemptNumber - a.attemptNumber);
    const latestAssessment = sortedAssessments[0] || { overallPercentage: 0 };
    const previousScore = sortedAssessments.length > 1 ? Number(sortedAssessments[1].overallPercentage.toFixed(2)) : 0;

    const recommendations = Object.entries(categoryScores)
      .filter(([_, score]) => score < 80)
      .map(([category, score]) => {
        const rec = {
          category,
          issue: `${category} Practices`,
          description: `Your ${category} score is below optimal (${score.toFixed(2)}%)`,
          action: `Review and improve your ${category.toLowerCase()} practices`,
          priority: score < 60 ? 'high' : 'medium'
        };
        switch (category) {
          case 'Password Management':
            rec.action = 'Use a password manager and create unique, strong passwords';
            break;
          case 'Authentication':
            rec.action = 'Enable multi-factor authentication on all sensitive accounts';
            break;
          case 'Device Security':
            rec.action = 'Ensure devices are locked with strong passwords or biometrics';
            break;
          case 'Network Security':
            rec.action = 'Use a VPN when connecting to public Wi-Fi';
            break;
          case 'Data Protection':
            rec.action = 'Set up automated, encrypted cloud backups';
            break;
          case 'Software Updates':
            rec.action = 'Enable automatic software updates';
            break;
          case 'Email Security':
            rec.action = 'Report and delete suspicious emails';
            break;
          case 'Physical Security':
            rec.action = 'Keep devices in a secure location';
            break;
          case 'Social Engineering':
            rec.action = 'Verify requests through official channels';
            break;
        }
        return rec;
      });

    const improvements = user.assessmentHistory.map(ah => ({
      date: new Date(ah.completedAt).toISOString().split('T')[0],
      score: Number(ah.overallPercentage.toFixed(2)),
      category: 'Overall',
      userName: ah.userName || user.name || 'User'
    }));

    res.json({
      userName: user.name || 'User',
      overallScore: Number(latestAssessment.overallPercentage.toFixed(2)),
      previousScore,
      lastAssessment,
      totalAssessments,
      attempts: attemptsWithChange,
      categoryScores,
      recommendations,
      improvements,
      benchmarks: {
        industry: 82,
        peers: 76,
        topPerformers: 95
      }
    });
  } catch (err) {
    console.error('Error in /api/user/report:', err.message, err.stack);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;