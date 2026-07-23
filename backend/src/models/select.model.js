import {Schema, model,Model } from "mongoose";
import mongoose from "mongoose";
const selectSchema = Schema({
    candidateId:{
        type:mongoose.Schema.Types.ObjectId,
    },
    companyId:{
        type:mongoose.Schema.Types.ObjectId
    },
})
export const Select = model("select",selectSchema);