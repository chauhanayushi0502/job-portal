import { model, Model, Schema } from "mongoose";
import mongoose from "mongoose";

const companySchema = Schema(
    {
  ownerId: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  companyName: {type:String},

  industry: {type:String},

  website: {type:String},

  email: {type:String},

  phone: {type:String},

  description: {type:String},

  logo: {type:String},

  foundedYear: {type:Number},

  employees: {type:Number},

  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    pincode: Number
  },

  createdAt: {type:Date},

  updatedAt: {type:Date}
}
);

export const Company = model("company", companySchema);
