import mongoose from 'mongoose';
import { Schema } from 'mongoose';
const userSchema =Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['candidate', 'company', 'admin'],
    default: 'candidate',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const User = mongoose.model('User', userSchema);