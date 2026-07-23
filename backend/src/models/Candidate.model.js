import { model, Model, Schema } from "mongoose";
import mongoose from "mongoose";
const candidateSchema = Schema(
{

  userId: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  fullName: {
    type:String
  },
  email:{
    type:String
  },

  gender: {type:String},

  dob: {type:Date},

  phone: {type:String},

  address: {type:String},

  city: {type:String},

  state: {type:String},

  country: {type:String},

  pincode: {type:Number},

  title: {type:String},

  skills: [String],

  education: [
    {
      degree: String,
      college: String,
      university: String,
      passingYear: Number,
      percentage: Number
    }
  ],

  experience: [
    {
      company: String,
      position: String,
      startDate: Date,
      endDate: Date,
      description: String
    }
  ],

  resume: {type:String},

  linkedin: {type:String},

  portfolio: {type:String},

  createdAt: {type:Date},

  updatedAt: {type:Date}
}
);

export const Candidates = model("candidate", candidateSchema);
