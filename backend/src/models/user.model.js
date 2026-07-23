import { Model, Schema, model } from "mongoose";

const userSchema = Schema({

  username: { type: String },

  email: { type: String },

  password: { type: String },

role: {
  type: String,
  enum: ["company", "candidate", "admin"],
  default: "candidate",
},

  profileImage: { type: String },

  isVerified: { type: Boolean },

  createdAt: { type: Date },

  updatedAt: { type: Date },
});

export const User = model("User", userSchema);
