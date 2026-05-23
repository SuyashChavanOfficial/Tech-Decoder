import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tech_decoder');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed. Ensure MongoDB is running locally on 127.0.0.1.');
    // TODO(security): Log detailed error internally, but avoid throwing raw DB secrets to stdout in production.
    process.exit(1);
  }
};
