import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const jobSchema = new Schema({
companyID: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Company",
  required: true,
},
companyName:{
  type: mongoose.Schema.Types.String,
  ref: "Company",
  required: true,
},

  title: { type: String },

  description: { type: String },

  category: { type: String },

  jobType: { type: String },

  experienceLevel: { type: String },

  salary: {
    min: Number,
    max: Number,
  },

  vacancies: { type: Number },

  skillsRequired: [String],

  phoneNumber:Number,

  location: {
    city: String,
    state: String,
    country: String,
  },

  deadline: { type: Date },

  status: {
    type: String,
    enum: ["Open", "Closed"],
  },

  createdAt: { type: Date },

  updatedAt: { type: Date },
});

export const Jobs = model("Job", jobSchema);
