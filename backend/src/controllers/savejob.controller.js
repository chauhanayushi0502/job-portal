import { savedjobs } from "../models/savejob.model.js";

export const savejob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const alreadySaved = await savedjobs.findOne({
      userId: req.user._id,
      jobId,
    });

    if (alreadySaved) {
      return res.status(400).json({
        message: "Job already saved",
      });
    }

    const savedJob = await savedjobs.create({
      userId: req.user._id,
      jobId,
    });

    res.status(201).json({
      message: "Job saved successfully",
      savedJob,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};

export const getsavedjobs = async (req, res) => {
  try {
    const jobs = await savedjobs.find({
      userId: req.user._id,
    });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};

export const removesavedjob = async (req, res) => {
  try {
    const { jobId } = req.params;

    await savedjobs.findOneAndDelete({
      userId: req.user._id,
      jobId,
    });

    res.status(200).json({
      message: "Saved job removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};