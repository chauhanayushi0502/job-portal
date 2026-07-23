import { model, Model, Schema } from "mongoose";

const savejobSchema = Schema(
    {
  userId: {
    type: ObjectId,
    ref: "User"
  },

  jobId: {
    type: ObjectId,
    ref: "Job"
  },

  savedAt: Date
}
);

export const Savejobs = model("savejobs", savejobSchema);
