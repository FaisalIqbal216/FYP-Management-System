const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Authorization Middleware Injection Node
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authorization token validation failure.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Access denied. Administrative scopes required.' });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token lifecycle state.' });
  }
};

// Fetch All Registered Supervisors
router.get('/supervisors', verifyAdmin, async (req, res) => {
  try {
    const supervisors = await User.find({ role: 'supervisor' }).select('-password');
    res.json(supervisors);
  } catch (err) {
    res.status(500).json({ message: 'Database transactional retrieval crash.' });
  }
});

// Inject New Supervisor Account Node
router.post('/supervisors', verifyAdmin, async (req, res) => {
  try {
    const { email, password, name, designation, field, maxStudents, education, roles } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Account constraint matching email already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newSv = new User({
      name, email, password: hashedPassword, role: 'supervisor',
      designation, field, maxStudents, education, roles
    });

    await newSv.save();
    res.status(201).json({ message: 'Supervisor committed successfully to secure state data blocks.' });
  } catch (err) {
    res.status(500).json({ message: 'Internal transaction state execution breakdown.' });
  }
});

// Update Target Supervisor
router.put('/supervisors/:id', verifyAdmin, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to sync modifications with data drivers.' });
  }
});

// Drop Target Supervisor Row
router.delete('/supervisors/:id', verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Profile row evicted from data maps.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to process deletion transaction query.' });
  }
});

module.exports = router;