// import { Company } from "../models/company.model.js";
// import { Jobs } from "../models/job.model.js";
// import { Applications } from "../models/application.model.js";
// import { Interview } from "../models/invite.model.js";
// import { Candidates } from "../models/Candidate.model.js";
// import { createNotification } from "./notification.controller.js";

// export const addcompany = async (req, res) => {
//   try {
//     if (req.user.role !== "company") {
//       return res.status(403).json({ success: false, message: "Only company can create profile" });
//     }

//     const { companyName, industry, website, phone, description, location } = req.body;

//     const company = await Company.findOneAndUpdate(
//       { ownerId: req.user._id },
//       { companyName, industry, website, phone, description, location },
//       { new: true, upsert: true }
//     );

//     res.status(200).json({ success: true, message: "Company profile updated", company });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// export const getcompany = async (req, res) => {
//   try {
//     const company = await Company.findOne({ ownerId: req.user._id });
//     if (!company) {
//       return res.status(404).json({ success: false, message: "Company not found" });
//     }
//     res.status(200).json({ success: true, company });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// export const updatecompany = async (req, res) => {
//   try {
//     const company = await Company.findOneAndUpdate(
//       { ownerId: req.user._id },
//       { $set: req.body },
//       { new: true }
//     );
//     res.status(200).json({ success: true, message: "Company updated", company });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// export const getCompanyJobs = async (req, res) => {
//   try {
//     const company = await Company.findOne({ ownerId: req.user._id });
//     if (!company) {
//       return res.status(404).json({ success: false, message: "Company not found" });
//     }

//     const jobs = await Jobs.find({ companyID: company._id }).sort({ createdAt: -1 });
//     res.status(200).json({ success: true, jobs });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// export const getJobApplicationsForCompany = async (req, res) => {
//   try {
//     const { jobId } = req.params;
//     const company = await Company.findOne({ ownerId: req.user._id });
//     if (!company) {
//       return res.status(404).json({ success: false, message: "Company not found" });
//     }

//     const applications = await Applications.find({ 
//       jobId, 
//       companyId: company._id 
//     })
//     .populate({
//       path: 'candidateId',
//       model: 'Candidate',
//       select: 'fullName email phone gender dob address city state country pincode title skills education experience resume linkedin portfolio'
//     })
//     .populate('jobId', 'title')
//     .sort({ appliedDate: -1 });

//     res.status(200).json({ success: true, applications });
//   } catch (error) {
//     console.error("Error fetching applications:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// export const updateApplicationStatus = async (req, res) => {
//   try {
//     const { appId } = req.params;
//     const { status } = req.body;

//     const application = await Applications.findByIdAndUpdate(
//       appId,
//       { status, updatedAt: new Date() },
//       { new: true }
//     );

//     const candidate = await Candidates.findById(application.candidateId);
//     if (candidate) {
//       await createNotification(
//         candidate.userId,
//         "candidate",
//         "Application Status Updated",
//         `Your application status is now: ${status}`,
//         "application",
//         application._id,
//         "Application"
//       );
//     }

//     res.status(200).json({ success: true, message: "Status updated", application });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// export const inviteCandidate = async (req, res) => {
//   try {
//     const { applicationId, interviewDate, interviewTime, interviewType, location, meetingLink } = req.body;

//     const company = await Company.findOne({ ownerId: req.user._id });
//     if (!company) {
//       return res.status(404).json({ success: false, message: "Company not found" });
//     }

//     const application = await Applications.findById(applicationId);
//     if (!application) {
//       return res.status(404).json({ success: false, message: "Application not found" });
//     }

//     const existing = await Interview.findOne({ applicationId });
//     if (existing) {
//       return res.status(400).json({ success: false, message: "Already invited" });
//     }

//     const interview = await Interview.create({
//       applicationId,
//       candidateId: application.candidateId,
//       jobId: application.jobId,
//       companyId: company._id,
//       interviewDate,
//       interviewTime,
//       interviewType: interviewType || "Online",
//       location,
//       meetingLink,
//       status: "Pending"
//     });

//     await Applications.findByIdAndUpdate(applicationId, { 
//       status: "Interview",
//       isInvited: true 
//     });

//     const candidate = await Candidates.findById(application.candidateId);
//     if (candidate) {
//       await createNotification(
//         candidate.userId,
//         "candidate",
//         "Interview Invitation",
//         `You have been invited for an interview on ${interviewDate} at ${interviewTime}`,
//         "interview",
//         interview._id,
//         "Interview"
//       );
//     }

//     res.status(201).json({ success: true, message: "Interview invited", interview });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// export const getCompanyNotifications = async (req, res) => {
//   try {
//     const company = await Company.findOne({ ownerId: req.user._id });
//     if (!company) {
//       return res.status(404).json({ success: false, message: "Company not found" });
//     }

//     const notifications = [];
//     res.status(200).json({ success: true, notifications });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

import { Company } from "../models/company.model.js";
import { Jobs } from "../models/job.model.js";
import { Applications } from "../models/application.model.js";
import { Interview } from "../models/invite.model.js";
import { Candidates } from "../models/Candidate.model.js";
import { createNotification } from "./notification.controller.js";

export const addcompany = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({ success: false, message: "Only company can create profile" });
    }

    const { companyName, industry, website, phone, description, location } = req.body;

    const company = await Company.findOneAndUpdate(
      { ownerId: req.user._id },
      { companyName, industry, website, phone, description, location },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, message: "Company profile updated", company });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getcompany = async (req, res) => {
  try {
    const company = await Company.findOne({ ownerId: req.user._id });
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }
    res.status(200).json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatecompany = async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      { ownerId: req.user._id },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ success: true, message: "Company updated", company });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCompanyJobs = async (req, res) => {
  try {
    const company = await Company.findOne({ ownerId: req.user._id });
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const jobs = await Jobs.find({ companyID: company._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getJobApplicationsForCompany = async (req, res) => {
  try {
    const { jobId } = req.params;
    const company = await Company.findOne({ ownerId: req.user._id });
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const applications = await Applications.find({ 
      jobId, 
      companyId: company._id 
    })
    .populate({
      path: 'candidateId',
      model: 'Candidate',
      select: 'fullName email phone gender dob address city state country pincode title skills education experience resume linkedin portfolio'
    })
    .populate('jobId', 'title')
    .sort({ appliedDate: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { appId } = req.params;
    const { status } = req.body;

    const application = await Applications.findByIdAndUpdate(
      appId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    const candidate = await Candidates.findById(application.candidateId);
    if (candidate) {
      await createNotification(
        candidate.userId,
        "candidate",
        "Application Status Updated",
        `Your application status is now: ${status}`,
        "application",
        application._id,
        "Application"
      );
    }

    res.status(200).json({ success: true, message: "Status updated", application });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const inviteCandidate = async (req, res) => {
  try {
    const { applicationId, interviewDate, interviewTime, interviewType, location, meetingLink } = req.body;

    const company = await Company.findOne({ ownerId: req.user._id });
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const application = await Applications.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const existing = await Interview.findOne({ applicationId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already invited" });
    }

    const interview = await Interview.create({
      applicationId,
      candidateId: application.candidateId,
      jobId: application.jobId,
      companyId: company._id,
      interviewDate,
      interviewTime,
      interviewType: interviewType || "Online",
      location,
      meetingLink,
      status: "Pending"
    });

    await Applications.findByIdAndUpdate(applicationId, { 
      status: "Interview",
      isInvited: true 
    });

    const candidate = await Candidates.findById(application.candidateId);
    if (candidate) {
      await createNotification(
        candidate.userId,
        "candidate",
        "Interview Invitation",
        `You have been invited for an interview on ${interviewDate} at ${interviewTime}`,
        "interview",
        interview._id,
        "Interview"
      );
    }

    res.status(201).json({ success: true, message: "Interview invited", interview });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCompanyNotifications = async (req, res) => {
  try {
    const company = await Company.findOne({ ownerId: req.user._id });
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const notifications = [];
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};