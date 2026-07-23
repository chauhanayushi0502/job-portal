import { Candidates } from "../models/Candidate.model.js";
import {User} from "../models/user.model.js"

export const addcandidate = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({
        message: "Only candidate users can create a candidate profile",
      });
    }
    const {
      gender,
      dob,
      phone,
      address,
      city,
      state,
      country,
      pincode,
      title,
      skills,
      education,
      experience,
      resume,
      linkedin,
      portfolio,
    } = req.body;
    const candidate = await Candidates.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          gender,
          dob,
          phone,
          address,
          city,
          state,
          country,
          pincode,
          title,
          skills,
          education,
          experience,
          resume,
          linkedin,
          portfolio,
        },
      },
      {
        new: true,
      },
    );

    if (!candidate) {
      return res.status(404).json({
        message: "candidate profile not found",
      });
    }

    res.status(200).json({
      message: "candidate profile updated successfully",
      candidate,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};

export const getcandidate = async (req, res) => {
  try {
    const candidate = await Candidates.findOne({
      userId: req.user._id,
    });

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate profile not found",
      });
    }

    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};

export const updatecandidate = async (req, res) => {
  try {
    const candidate = await Candidates.findOneAndUpdate(
      { userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate profile not found",
      });
    }

    res.status(200).json({
      message: "Candidate profile updated successfully",
      candidate,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};
export const checkProfile = async (req, res) => {
  try {
    const candidate = await Candidates.findOne({ userId: req.user._id });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found",
      });
    }

    const profileComplete =
      candidate.gender &&
      candidate.dob &&
      candidate.phone &&
      candidate.address &&
      candidate.city &&
      candidate.state &&
      candidate.country &&
      candidate.pincode &&
      candidate.title &&
      candidate.skills &&
      candidate.education?.length > 0 &&
      candidate.resume;

    res.status(200).json({
      success: true,
      profileComplete,
      candidate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
