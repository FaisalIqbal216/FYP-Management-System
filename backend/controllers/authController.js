const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Student Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, rollNo, department, batch, semester } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name, email, password: hashed,
      role: 'student', rollNo, department, batch, semester
    });

    res.status(201).json({ token: generateToken(user._id), user: { ...user._doc, password: undefined } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login (all roles)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: 'Invalid credentials' });

    user.lastLogin = new Date();
    await user.save();

    res.json({ token: generateToken(user._id), user: { ...user._doc, password: undefined } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  res.json(req.user);
};