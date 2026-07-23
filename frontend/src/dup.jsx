import Candidates from "../models/candidate.model.js";
import Jobs from "../models/job.model.js";

export const Applyjob = async (req, res) => {
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
      companyId: job.companyId,
      jobId: job._id,
      resume: candidate.resume,
      status: "Pending",
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
export default Applyjob;