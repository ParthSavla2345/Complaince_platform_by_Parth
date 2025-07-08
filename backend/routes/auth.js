const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Auth = require('../models/Auth');

router.post('/register', async (req, res) => {
  const { name, email, password, userType, companyName, phone, department, adminCode } = req.body;

  try {
    let auth = await Auth.findOne({ email });
    if (auth) {
      console.log(`Auth already exists for email: ${email}`);
      return res.status(400).json({ error: 'User already exists' });
    }

    // Validate adminCode for admin userType
    if (userType === 'admin' && adminCode !== process.env.ADMIN_CODE) {
      console.log(`Invalid admin code for email: ${email}`);
      return res.status(400).json({ error: 'Invalid admin code' });
    }

    auth = new Auth({
      email,
      password, // Password will be hashed by the schema's pre-save hook
      userType: userType || 'user',
      profile: {
        name: name || 'Default User',
        companyName: companyName || undefined,
        phone: phone || undefined,
        department: department || undefined
      }
    });

    await auth.save();

    // Create corresponding User document
    let user = await User.findOne({ userId: auth._id.toString() });
    if (!user) {
      user = new User({
        userId: auth._id.toString(),
        name: name || 'Default User',
        email,
        password: auth.password,
        questionHistory: [],
        categoryScores: [],
        totalScore: 0,
        totalPossibleScore: 0,
        overallPercentage: 0,
        lastActivity: new Date(),
        assessmentAttempts: 0
      });
      await user.save();
      console.log(`Created User document for: ${auth._id.toString()}`);
    }

    res.json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Error in /api/register:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    console.log(`Login attempt for email: ${email}, userType: ${userType || 'user'}`);
    const auth = await Auth.findOne({ email, userType: userType || 'user' });
    if (!auth) {
      console.log(`Auth not found for email: ${email}, userType: ${userType || 'user'}`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, auth.password);
    if (!isMatch) {
      console.log(`Password mismatch for email: ${email}`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    let user = await User.findOne({ userId: auth._id.toString() });
    if (!user) {
      user = new User({
        userId: auth._id.toString(),
        name: auth.profile.name || 'Default User',
        email: auth.email,
        password: auth.password,
        questionHistory: [],
        categoryScores: [],
        totalScore: 0,
        totalPossibleScore: 0,
        overallPercentage: 0,
        lastActivity: new Date(),
        assessmentAttempts: 0
      });
      await user.save();
      console.log(`Created User document for: ${auth._id.toString()}`);
    }

    const token = jwt.sign(
      { userId: auth._id.toString(), userType: auth.userType, name: auth.profile.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`Login successful, userId: ${auth._id.toString()}`);
    res.json({
      token,
      user: {
        id: auth._id.toString(),
        name: auth.profile.name || 'Default User',
        email: auth.email,
        userType: auth.userType
      }
    });
  } catch (err) {
    console.error('Error in /api/login:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;