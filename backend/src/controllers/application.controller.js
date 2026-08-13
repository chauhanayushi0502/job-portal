import { Applications } from "../models/application.model.js";
import { Jobs } from "../models/job.model.js";
import { Candidates } from "../models/Candidate.model.js";
import { Company } from "../models/company.model.js";
import { createNotification } from "./notification.controller.js";

export const applyjob = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Only candidates can apply for jobs.",
      });
    }

    const { jobId, message } = req.body;

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
    const profileComplete = !!(
      candidate.fullName &&
      candidate.email &&
      candidate.phone &&
      candidate.address &&
      candidate.city &&
      candidate.state &&
      candidate.country &&
      candidate.pincode &&
      candidate.title &&             
      candidate.skills?.length > 0 &&
      candidate.education?.length > 0 &&
      candidate.resume
    );

    if (!profileComplete) {
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
      status: "Pending",
      appliedDate: new Date(),
      message: message || "",
    });

    try {
      const company = await Company.findById(job.companyID);
      if (company) {
        await createNotification(
          company.ownerId,
          "company",
          "New Application Received",
          `${candidate.fullName} has applied for "${job.title}"`,
          "application",
          application._id,
          "Application"
        );
      }
    } catch (notifError) {
      console.error("Error sending notification:", notifError);
    }

    return res.status(201).json({
      success: true,
      message: "Job applied successfully.",
      application,
    });
  } catch (error) {
    console.error("Error in applyjob:", error);
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

    const candidate = await Candidates.findOne({ userId: req.user._id });
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate profile not found.",
      });
    }

    const history = await Applications.find({ candidateId: candidate._id })
      .populate({
        path: "jobId",
        select: "title salary location category companyName",
      })
      .populate({
        path: "companyId",
        select: "companyName logo",
      })
      .sort({ appliedDate: -1 });

    return res.status(200).json({
      success: true,
      totalApplications: history.length,
      history,
    });
  } catch (error) {
    console.error("Error in applyhistory:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};