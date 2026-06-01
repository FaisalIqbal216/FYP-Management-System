const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// 1. Submit Proposal
router.post('/proposal', protect, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied. Student context required.' });
    }

    const { title, description, supervisorEmail } = req.body;
    const supervisor = await User.findOne({ email: supervisorEmail, role: 'supervisor' });
    if (!supervisor) return res.status(404).json({ message: 'Faculty supervisor matching this email not found.' });

    // Check if student already submitted a proposal
    const existingProposal = await Project.findOne({ studentId: req.user._id });
    if (existingProposal) return res.status(400).json({ message: 'You have already submitted a proposal.' });

    const newProject = new Project({
      title,
      description,
      supervisorEmail,
      studentId: req.user._id,
      supervisorId: supervisor._id
    });
    
    await newProject.save();
    await User.findByIdAndUpdate(req.user._id, { projectId: newProject._id });

    res.status(201).json({ message: 'Proposal submitted successfully.', proposal: newProject });
  } catch (err) {
    res.status(500).json({ message: 'Transaction tracking collection anomaly: ' + err.message });
  }
});

// 2. Get Student Proposal
router.get('/proposal', protect, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied.' });
    }
    const proposal = await Project.findOne({ studentId: req.user._id });
    res.json(proposal);
  } catch (err) {
    res.status(500).json({ message: 'Database fetch fault.' });
  }
});

router.get('/progress', protect, (req, res) => res.json([]));
router.get('/feedback', protect, (req, res) => res.json([]));

module.exports = router;