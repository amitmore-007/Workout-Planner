const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Creator = require('../models/creatorModel');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await Creator.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Creator already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCreator = new Creator({ name, email, password: hashedPassword });

    await newCreator.save();
    res.status(201).json({ msg: 'Creator registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error registering creator' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const creator = await Creator.findOne({ email });
    if (!creator) return res.status(400).json({ msg: 'Creator not found' });

    const isMatch = await bcrypt.compare(password, creator.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: creator._id, role: 'creator' }, 'your_jwt_secret', { expiresIn: '2d' });
    res.json({ token, creator: { id: creator._id, name: creator.name, email: creator.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Login error' });
  }
});

module.exports = router;
