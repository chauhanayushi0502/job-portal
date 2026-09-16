import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const companySchema =Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  companyName: {
    type: String,
    // required: true, 
    default: '',
  },
  email: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  logo: {
    type: String,
    default: '',
  },
  foundedYear: {
    type: Number,
    default: null,
  },
  employees: {
    type: Number,
    default: null,
  },
  location: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Company = mongoose.model('Company', companySchema);