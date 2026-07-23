import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { Candidates } from "../models/Candidate.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const jwtsec = "abxy";

export const adduser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, Email and Password are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username or Email already exists",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: encryptedPassword,
      role: role || "candidate",
    });

    if (user.role === "company") {
      await Company.create({
        ownerId: user._id,
        companyName: user.username,
        email: user.email,
      });
    }
    if (user.role === "candidate") {
      await Candidates.create({
        userId: user._id,
        fullName: user.username,
        email: user.email,
      });
    }
    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and Password are required",
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      jwtsec,
      {
        expiresIn: "10d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};

export const updateuser = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const update = { ...req.body };

    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (updatedUser.role === "company") {
      await Company.findOneAndUpdate(
        { ownerId: updatedUser._id },
        {
          companyName: updatedUser.username,
          email: updatedUser.email,
        }
      );
    }

    res.status(200).json({
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};