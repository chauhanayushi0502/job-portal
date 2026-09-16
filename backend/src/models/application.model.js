import mongoose from 'mongoose';
import { Schema } from 'mongoose';
const applicationSchema = Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
    default: 'Pending',
  },
  isInvited: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: '',
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Applications = mongoose.model('Application', applicationSchema);