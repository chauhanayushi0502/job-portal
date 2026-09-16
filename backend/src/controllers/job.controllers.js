// import { Jobs } from "../models/job.model.js";
// import { Company } from "../models/company.model.js";
// import { Applications } from "../models/application.model.js";

// export const addjob = async (req, res) => {
//   try {
//     if (req.user.role !== "company") {
//       return res.status(403).json({ success: false, message: "Only companies can add jobs" });
//     }

//     const company = await Company.findOne({ ownerId: req.user._id });
//     if (!company) {
//       return res.status(404).json({ success: false, message: "Company profile not found" });
//     }

//     const { title, description, salary, location, category, vacancies, deadline } = req.body;

//     if (!title || !description || !location || !category) {
//       return res.status(400).json({ success: false, message: "Title, description, location, and category are required" });
//     }

//     const job = await Jobs.create({
//       companyID: company._id,
//       companyName: company.companyName,
//       title,
//       description,
//       salary: salary || { min: 0, max: 0 },
//       location,
//       category,
//       vacancies: vacancies || 1,
//       deadline: deadline || null,
//       status: "Open",
//       createdAt: new Date(),
//     });

//     res.status(201).json({ success: true, message: "Job created successfully", job });
//   } catch (error) {
//     console.error("Error adding job:", error);
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

// export const updatejob = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const job = await Jobs.findById(id);
//     if (!job) {
//       return res.status(404).json({ success: false, message: "Job not found" });
//     }

//     const company = await Company.findOne({ ownerId: req.user._id });
//     if (!company || job.companyID.toString() !== company._id.toString()) {
//       return res.status(403).json({ success: false, message: "Unauthorized" });
//     }

//     const updatedJob = await Jobs.findByIdAndUpdate(
//       id,
//       { $set: req.body, updatedAt: new Date() },
//       { new: true }
//     );

//     res.status(200).json({ success: true, message: "Job updated", job: updatedJob });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// export const deletejob = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const job = await Jobs.findById(id);
//     if (!job) {
//       return res.status(404).json({ success: false, message: "Job not found" });
//     }

//     const company = await Company.findOne({ ownerId: req.user._id });
//     if (!company || job.companyID.toString() !== company._id.toString()) {
//       return res.status(403).json({ success: false, message: "Unauthorized" });
//     }

//     await Applications.deleteMany({ jobId: job._id });
//     await Jobs.findByIdAndDelete(id);

//     res.status(200).json({ success: true, message: "Job deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// export const getAllJobs = async (req, res) => {
//   try {
//     const jobs = await Jobs.find({ status: "Open" })
//       .populate("companyID", "companyName logo location")
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, jobs });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// export const getJobById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const job = await Jobs.findById(id)
//       .populate("companyID", "companyName logo industry description website location");

//     if (!job) {
//       return res.status(404).json({ success: false, message: "Job not found" });
//     }

//     const applicationCount = await Applications.countDocuments({ jobId: job._id });

//     res.status(200).json({ 
//       success: true, 
//       job: {
//         ...job.toObject(),
//         applicationCount
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


import { Jobs } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { Applications } from "../models/application.model.js";

export const addjob = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({ success: false, message: "Only companies can add jobs" });
    }

    const company = await Company.findOne({ ownerId: req.user._id });
    if (!company) {
      return res.status(404).json({ success: false, message: "Company profile not found" });
    }
    if (!company.companyName || company.companyName.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: "Please update your company profile (Company Name is required) before adding a job." 
      });
    }

    const { title, description, salary, location, category, vacancies, deadline } = req.body;

    if (!title || !description || !location || !category) {
      return res.status(400).json({ success: false, message: "Title, description, location, and category are required" });
    }

    const job = await Jobs.create({
      companyID: company._id,
      companyName: company.companyName,
      title,
      description,
      salary: salary || { min: 0, max: 0 },
      location,
      category,
      vacancies: vacancies || 1,
      deadline: deadline || null,
      status: "Open",
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, message: "Job created successfully", job });
  } catch (error) {
    console.error("Error adding job:", error);
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

export const updatejob = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await Jobs.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const company = await Company.findOne({ ownerId: req.user._id });
    if (!company || job.companyID.toString() !== company._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const updatedJob = await Jobs.findByIdAndUpdate(
      id,
      { $set: req.body, updatedAt: new Date() },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Job updated", job: updatedJob });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deletejob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Jobs.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const company = await Company.findOne({ ownerId: req.user._id });
    if (!company || job.companyID.toString() !== company._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Applications.deleteMany({ jobId: job._id });
    await Jobs.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Jobs.find({ status: "Open" })
      .populate("companyID", "companyName logo location")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Jobs.findById(id)
      .populate("companyID", "companyName logo industry description website location");

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const applicationCount = await Applications.countDocuments({ jobId: job._id });

    res.status(200).json({ 
      success: true, 
      job: {
        ...job.toObject(),
        applicationCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};