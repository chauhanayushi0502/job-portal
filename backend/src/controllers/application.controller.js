import { Applications } from "../models/application.model.js";
import { Jobs } from "../models/job.model.js";
import { Candidates } from "../models/Candidate.model.js";
import { Company } from "../models/company.model.js";
import { application } from "express";

export const applyjob = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Only candidates can apply for jobs.",
      });
    }
    const { jobId } = req.body;
    const job = await Jobs.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }
    const candidate = await Candidates.findOne({ userId: req.user._id });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found.",
      });
    }
    if (
      !candidate.gender ||
      !candidate.dob ||
      !candidate.phone ||
      !candidate.address ||
      !candidate.city ||
      !candidate.state ||
      !candidate.country ||
      !candidate.pincode ||
      !candidate.title ||
      !candidate.skills ||
      candidate.education.length === 0 ||
      !candidate.resume
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete your profile before applying for jobs.",
      });
    }

    const alreadyApplied = await Applications.findOne({
      candidateId: candidate._id,
      jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }
    const application = await Applications.create({
      candidateId: candidate._id,
      companyId: job.companyID,
      jobId: job._id,
      // resume: candidate.resume,
      // status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Job applied successfully.",
      application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const applyhistory = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Only candidates can view application history.",
      });
    }

    const candidate = await Candidates.findOne({
      userId: req.user._id,
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found.",
      });
    }

    const history = await Applications.find({
      candidateId: candidate._id,
    }).populate({
      path: "jobId",
      select: "title salary location category companyID companyName",
    });
    return res.status(200).json({
      success: true,
      totalApplications: history.length,
      history,
    });
    //  console.log(history)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const history = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Only company can view application history.",
      });
    }

    const company = await Company.findOne({
      ownerId: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found.",
      });
    }
    const history = await Applications.find({
      companyId: company._id,
    })
      .populate({
        path: "candidateId",
        select: "fullName email phone skills education experience",
      })
      .populate({
        path: "jobId",
        select: "title",
      });
    return res.status(200).json({
      success: true,
      totalApplications: history.length,
      history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const select = async () => {
  try {
    
  } catch (error) {
    console.log(error.message);
  }
};
