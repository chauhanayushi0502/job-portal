import mongoose from 'mongoose';
import { Schema } from 'mongoose';
const interviewSchema =Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  interviewDate: {
    type: Date,
    required: true,
  },
  interviewTime: {
    type: String,
    required: true,
  },
  interviewType: {
    type: String,
    enum: ['Online', 'Offline', 'Phone', 'Video'],
    default: 'Online',
  },
  location: {
    type: String,
    default: '',
  },
  meetingLink: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  isInvited: {
    type: Boolean,
    default: true,
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

export const Interview = mongoose.model('Interview', interviewSchema);