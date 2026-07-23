import { model, Model, Schema } from "mongoose";
import mongoose from "mongoose";

const applicationSchema = Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "candidate",
  },

  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },

  resume: String,

  coverLetter: String,

  status: {
    type: String,
    enum: [
      "Applied",
      "Reviewed",
      "Shortlisted",
      "Interview",
      "Selected",
      "Rejected",
    ],
  },

  appliedDate: Date,

  updatedAt: Date,
});

export const Applications = model("applications", applicationSchema);
