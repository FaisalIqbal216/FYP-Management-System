require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();

app.use(cors()); // Simplified CORS
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/supervisor', require('./routes/supervisorRoutes')); // Naya Route

const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to Database!');
    // ... admin creation code remains same ...
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error('❌ CRITICAL ERROR:', error.message);
  }
};
startServer();