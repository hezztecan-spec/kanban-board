const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://hezztecan_db_user:e0okOrbgAKuOAoJn@cluster0.hxjlirv.mongodb.net/kanban-board?retryWrites=true&w=majority');

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
