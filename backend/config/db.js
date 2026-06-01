const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4
    });
    console.log('✅ MongoDB Connected!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
};

module.exports = connectDB;