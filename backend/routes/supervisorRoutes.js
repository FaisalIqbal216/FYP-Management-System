const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');

router.post('/add', async (req, res) => {
  try {
    const { name, email, password, phone, designation, bio } = req.body;
    
    // Check agar user pehle se exist karta hai
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered!" });

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newSupervisor = new User({
      name, email, 
      password: hashedPassword, 
      phone, 
      designation, 
      field: bio, // Schema ke mutabiq bio ko field mein save kiya
      role: 'supervisor'
    });
    
    await newSupervisor.save();
    res.status(201).json({ message: "Supervisor saved permanently!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    // Database se saare supervisor nikal rahe hain
    const supervisors = await User.find({ role: 'supervisor' });
    
    // Frontend ke hisaab se data map karke bhejein
    const formatted = supervisors.map(sv => ({
      id: sv._id, // sv.id ki jagah sv._id
      name: sv.name,
      email: sv.email,
      department: sv.department || "N/A",
      status: sv.isActive ? "Active" : "Inactive", // sv.status ki jagah
      specialization: sv.field || "N/A", // sv.specialization ki jagah
      maxProjects: sv.maxStudents || 0 // sv.maxProjects ki jagah
    }));
    
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;