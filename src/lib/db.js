// src/utils/db.js or src/lib/db.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI in .env.local');
}
console.log(MONGODB_URI,'MONGODB_URI')

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
        console.log('MongoDB connected successfully');
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
