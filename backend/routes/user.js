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

    if (!question.complianceName) {
      console.log(`Question ${questionId} has no complianceName`);
      return res.status(500).json({ error: 'Question missing complianceName' });
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
      console.log(`Started new attempt ${currentAttempt} for user: ${userId}`);
    }

    const existingAnswer = user.questionHistory.find(
      history => history.questionId.toString() === questionId && history.attemptNumber === currentAttempt
    );
    if (existingAnswer) {
      console.log(`Question already answered: ${questionId} by user: ${userId} for attempt: ${currentAttempt}`);
      return res.status(400).json({ error: 'Question already answered for this attempt' });
    }

    const scoreEarned = option.weight;

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
        totalPossible: 0,
        percentageScore: 0,
        questionsAnswered: 0,
        lastActivity: new Date(),
        attemptNumber: currentAttempt
      };
      user.categoryScores.push(categoryScore);
    }

    categoryScore.totalScored += scoreEarned;
    categoryScore.totalPossible += 100;
    categoryScore.questionsAnswered += 1;
    categoryScore.percentageScore = categoryScore.totalPossible > 0
      ? Number(((categoryScore.totalScored / categoryScore.totalPossible) * 100).toFixed(2))
      : 0;
    categoryScore.lastActivity = new Date();

    // Initialize all categories
    const allCategories = [
      'Password Management',
      'Authentication',
      'Device Security',
      'Network Security',
      'Data Protection'
    ];
    for (const category of allCategories) {
      if (!user.categoryScores.some(cs => cs.complianceName === category && cs.attemptNumber === currentAttempt)) {
        user.categoryScores.push({
          complianceName: category,
          totalScored: 0,
          totalPossible: 0,
          percentageScore: 0,
          questionsAnswered: 0,
          lastActivity: new Date(),
          attemptNumber: currentAttempt
        });
      }
    }

    // Calculate total score
    const attemptCategories = user.categoryScores.filter(cs => cs.attemptNumber === currentAttempt);
    user.totalScore = attemptCategories.reduce((sum, cs) => sum + (cs.totalScored || 0), 0);
    user.totalPossibleScore = attemptCategories.reduce((sum, cs) => sum + (cs.totalPossible || 0), 0);
    user.overallPercentage = user.totalPossibleScore > 0 
      ? Number(((user.totalScore / user.totalPossibleScore) * 100).toFixed(2))
      : 0;
    user.lastActivity = new Date();

    console.log(`Pre-save: attempt=${currentAttempt}, totalScore=${user.totalScore}, totalPossible=${user.totalPossibleScore}, overallPercentage=${user.overallPercentage}, categoryScore=${JSON.stringify(categoryScore)}`);

    if (isLastQuestion) {
      // Validate 10 questions answered
      const questionsAnswered = user.questionHistory.filter(h => h.attemptNumber === currentAttempt).length;
      if (questionsAnswered !== 10) {
        console.warn(`Attempt ${currentAttempt} for user ${userId} has ${questionsAnswered} questions, expected 10`);
      }
      if (!user.assessmentHistory.some(h => h.attemptNumber === currentAttempt)) {
        user.assessmentAttempts += 1;
        user.assessmentHistory.push({
          overallPercentage: user.overallPercentage,
          completedAt: new Date(),
          attemptNumber: currentAttempt,
          userName: user.name || 'User'
        });
        console.log(`Completed assessment attempt ${currentAttempt} for user: ${userId}, overallPercentage: ${user.overallPercentage}`);
      }
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
        totalPossible: categoryScore.totalPossible,
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

    // Fetch 10 questions, ensuring at least one from each category
    const allCategories = [
      'Password Management',
      'Authentication',
      'Device Security',
      'Network Security',
      'Data Protection'
    ];

    let questions = [];
    for (const category of allCategories) {
      const categoryQuestions = await Question.find({
        complianceName: category,
        userType: { $in: [userType, 'both'] },
        isActive: true,
        _id: { $nin: answeredQuestionIds.map(id => new mongoose.Types.ObjectId(id)) }
      }).limit(category === 'Password Management' ? 3 : category === 'Authentication' || category === 'Device Security' || category === 'Data Protection' ? 2 : 1);
      questions.push(...categoryQuestions);
    }

    console.log(`Returning ${questions.length} questions for userType: ${userType}`);
    if (questions.length === 0) {
      console.warn('No questions found for query:', { userType, isActive: true });
      return res.status(404).json({ error: 'No questions available' });
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

    // Determine the latest attempt
    const latestAttempt = user.assessmentHistory.length > 0
      ? Math.max(...user.assessmentHistory.map(h => h.attemptNumber))
      : user.assessmentAttempts || 0;

    console.log(`Latest attempt for user ${userId}: ${latestAttempt}`);

    const allCategories = [
      'Password Management',
      'Authentication',
      'Device Security',
      'Network Security',
      'Data Protection'
    ];

    // Fetch or recalculate category scores
    let categoryScores = user.categoryScores.filter(cs => cs.attemptNumber === latestAttempt);
    if (categoryScores.length < allCategories.length || user.questionHistory.some(h => h.attemptNumber === latestAttempt)) {
      console.warn(`Incomplete categoryScores for attempt ${latestAttempt}, recalculating from questionHistory`);
      const questionHistory = user.questionHistory.filter(h => h.attemptNumber === latestAttempt);
      const categoryMap = {};

      for (const category of allCategories) {
        const categoryQuestions = questionHistory.filter(h => h.complianceName === category);
        const totalScored = categoryQuestions.reduce((sum, h) => sum + (h.scoreEarned || 0), 0);
        const totalPossible = categoryQuestions.length * 100;
        const questionsAnswered = categoryQuestions.length;
        categoryMap[category] = {
          complianceName: category,
          totalScored,
          totalPossible,
          percentageScore: totalPossible > 0 ? Number(((totalScored / totalPossible) * 100).toFixed(2)) : 0,
          questionsAnswered,
          lastActivity: questionsAnswered > 0 ? new Date(Math.max(...categoryQuestions.map(h => new Date(h.answeredAt)))) : new Date(),
          attemptNumber: latestAttempt
        };
        // Update existing or add new
        const existingScore = user.categoryScores.find(cs => cs.complianceName === category && cs.attemptNumber === latestAttempt);
        if (existingScore) {
          Object.assign(existingScore, categoryMap[category]);
        } else {
          user.categoryScores.push(categoryMap[category]);
        }
      }
      categoryScores = Object.values(categoryMap);
      await user.save();
      console.log(`Recalculated and saved categoryScores for attempt ${latestAttempt}`);
    }

    const categoryScoresMap = Object.fromEntries(
      allCategories.map(category => {
        const cs = categoryScores.find(cs => cs.complianceName === category);
        return [category, cs && cs.questionsAnswered > 0 ? Number(cs.percentageScore.toFixed(2)) : 0];
      })
    );

    // Calculate overall score
    const totalScored = categoryScores.reduce((sum, cs) => sum + (cs.totalScored || 0), 0);
    const totalPossible = categoryScores.reduce((sum, cs) => sum + (cs.totalPossible || 0), 0);
    const overallPercentage = totalPossible > 0 ? Number(((totalScored / totalPossible) * 100).toFixed(2)) : 0;

    // Update assessmentHistory if needed
    if (user.questionHistory.filter(h => h.attemptNumber === latestAttempt).length > 0) {
      let latestAssessment = user.assessmentHistory.find(h => h.attemptNumber === latestAttempt);
      if (latestAssessment) {
        latestAssessment.overallPercentage = overallPercentage;
        latestAssessment.completedAt = new Date();
      } else {
        user.assessmentHistory.push({
          overallPercentage: overallPercentage,
          completedAt: new Date(),
          attemptNumber: latestAttempt,
          userName: user.name || 'User'
        });
      }
      await user.save();
    }

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

    const totalAssessments = user.assessmentHistory.length;

    const sortedAssessments = user.assessmentHistory.sort((a, b) => b.attemptNumber - a.attemptNumber);
    const latestAssessment = sortedAssessments[0] || { overallPercentage: overallPercentage };
    const previousScore = sortedAssessments.length > 1 ? Number(sortedAssessments[1].overallPercentage.toFixed(2)) : 0;

    const recommendations = Object.entries(categoryScoresMap)
      .filter(([_, score]) => score < 80)
      .map(([category, score]) => {
        const rec = {
          category,
          issue: `${category} Practices`,
          description: `Your ${category} score is ${score.toFixed(2)}%, which is below the recommended threshold of 80%.`,
          action: `Improve your ${category.toLowerCase()} practices`,
          priority: score < 60 ? 'high' : 'medium'
        };
        switch (category) {
          case 'Password Management':
            rec.action = 'Use a password manager to generate and store unique, strong passwords';
            break;
          case 'Authentication':
            rec.action = 'Enable multi-factor authentication on all sensitive accounts';
            break;
          case 'Device Security':
            rec.action = 'Ensure devices are locked with strong passwords or biometrics';
            break;
          case 'Network Security':
            rec.action = 'Use secure, private Wi-Fi with WPA3 or WPA2 encryption';
            break;
          case 'Data Protection':
            rec.action = 'Set up automated, encrypted cloud backups';
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

    console.log(`Report for user ${userId}: overallScore=${latestAssessment.overallPercentage}, categoryScores=${JSON.stringify(categoryScoresMap)}, totalAssessments=${totalAssessments}`);

    res.json({
      userName: user.name || 'User',
      overallScore: Number(latestAssessment.overallPercentage.toFixed(2)),
      previousScore,
      lastAssessment,
      totalAssessments,
      attempts: attemptsWithChange,
      categoryScores: categoryScoresMap,
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