require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();

app.use(cors({
  origin: '*',
  credentials: false
}));

app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/supervisor', require('./routes/supervisorRoutes'));
const startServer = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to Database successfully!');
    
    const exists = await User.findOne({ role: 'admin' });
    if (!exists) {
      const hashed = await bcrypt.hash('admin123', 12);
      await User.create({ 
        name: 'Admin', 
        email: 'admin@fui.edu.pk', 
        password: hashed, 
        role: 'admin' 
      });
      console.log('✅ Admin created');
    } else {
      console.log('✅ Admin already exists');
    }
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

  } catch (error) {
    console.error('❌ CRITICAL ERROR:', error.message);
    process.exit(1);
  }
};

startServer();