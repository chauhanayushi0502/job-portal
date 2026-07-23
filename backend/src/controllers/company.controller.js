import { Company } from "../models/company.model.js";

export const addcompany = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({
        message: "Only company users can create a company profile",
      });
    }

    const {
      industry,
      website,
      phone,
      description,
      logo,
      foundedYear,
      employees,
      location,
    } = req.body;

    const company = await Company.findOneAndUpdate(
      { ownerId: req.user._id },
      {
        $set: {
          industry,
          website,
          phone,
          description,
          logo,
          foundedYear,
          employees,
          location,
        },
      },
      {
        new: true,
      }
    );

    if (!company) {
      return res.status(404).json({
        message: "Company profile not found",
      });
    }

    res.status(200).json({
      message: "Company profile updated successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};

export const getcompany = async (req, res) => {
  try {
    const company = await Company.findOne({
      ownerId: req.user._id,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company profile not found",
      });
    }

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};

export const updatecompany = async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      { ownerId: req.user._id },
      { $set: req.body },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({
        message: "Company profile not found",
      });
    }

    res.status(200).json({
      message: "Company profile updated successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};