import mongoose from 'mongoose';
import { Schema } from 'mongoose';
const candidateSchema =Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: String,
  dob: Date,
  phone: String,
  address: String,
  city: String,
  state: String,
  country: String,
  pincode: String,
  title: String,
  skills: [String],
  education: [Object],
  experience: [Object],
  resume: String,
  linkedin: String,
  portfolio: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Candidates = mongoose.model('Candidate', candidateSchema);