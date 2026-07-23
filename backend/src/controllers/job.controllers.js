import { Jobs } from "../models/job.model.js";
import { Company } from "../models/company.model.js";

export const addjob = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({
        message: "Only companies can add jobs",
      });
    }

    const company = await Company.findOne({ ownerId: req.user._id });
    if (!company) {
      return res.status(404).json({
        message: "Please create your company profile first",
      });
    }

    const {
      title,
      description,
      minsalary,
      maxslary,
      location,
      salary,
      category,
      vacancies,
      deadline,
    } = req.body;
//     console.log(company);
// console.log(company._id);
    const job = await Jobs.create({
      companyID: company._id,
      companyName: company.companyName,
      title,
      description,
      salary,
      location,
      category,
      vacancies,
      deadline,
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};

// export const getjobs = async (req, res) => {
//   try {
//     const company = await Company.findOne({ ownerId: req.user._id });

//     if (!company) {
//       return res.status(404).json({
//         message: "Company not found",
//       });
//     }

//     const jobs = await Jobs.find({ companyID: Company._id });
//     console.log(jobs);
//     res.status(200).json({
//       message: "Jobs fetched successfully",
//       jobs,
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: error.message || "Internal Server Error",
//     });
//   }
// };

export const getjobs = async (req, res) => {
  try {
    const company = await Company.findOne({ ownerId: req.user._id });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const jobs = await Jobs.find({ companyID: company._id });

    res.status(200).json({
      message: "Jobs fetched successfully",
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};
export const getalljob = async (req, res) => {
  try {
    const jobs = await Jobs.find();
    res.status(200).json({
      message: "Jobs fetched successfully",
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};
export const updatejob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Jobs.findById(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const company = await Company.findOne({ ownerId: req.user._id });

    if (!company || job.companyID.toString() !== company._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const updatedJob = await Jobs.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      message: "Job updated successfully",
      updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};

export const deletejob = async (req, res) => {
  try {
    const { id } = req.query;

    const job = await Jobs.findById(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const company = await Company.findOne({ ownerId: req.user._id });

    await Jobs.findByIdAndDelete(id);

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};
