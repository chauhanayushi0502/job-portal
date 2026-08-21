import { Schema } from 'mongoose';
import mongoose from 'mongoose';

const notificationSchema =Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  recipientRole: {
    type: String,
    enum: ['candidate', 'company', 'admin'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['general', 'interview', 'selection', 'application', 'job'],
    default: 'general',
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  relatedModel: {
    type: String,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Notification = mongoose.model('Notification', notificationSchema);