import { model, Model, Schema } from "mongoose";
import mongoose from "mongoose";
const notificationSchema = Schema(
{

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  title: String,

  message: String,

  type: String,

  isRead: Boolean,

  createdAt: Date
}
);

export const Notification = model("notification", notificationSchema);
