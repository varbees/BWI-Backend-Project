import mongoose from 'mongoose';
import { __db__ } from './constants.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(__db__);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Err?: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
