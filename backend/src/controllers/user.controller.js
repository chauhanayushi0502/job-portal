// import { User } from "../models/user.model.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// export const jwtsec = "abxy";

// export const adduser = async (req, res) => {
//   try {
//     const { username, email, password, role } = req.body;

//     if (!username || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Username, Email and Password are required",
//       });
//     }

//     const existingUser = await User.findOne({
//       $or: [{ username }, { email }],
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "Username or Email already exists",
//       });
//     }

//     const encryptedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       username,
//       email,
//       password: encryptedPassword,
//       role: role || "candidate",
//     });

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({
//       success: false,
//       error: error.message || "Internal Server Error",
//     });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Username and Password are required",
//       });
//     }

//     const user = await User.findOne({ username });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const isValid = await bcrypt.compare(password, user.password);

//     if (!isValid) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid password",
//       });
//     }

//     const token = jwt.sign(
//       {
//         userId: user._id,
//         role: user.role,
//       },
//       jwtsec,
//       {
//         expiresIn: "10d",
//       }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({
//       success: false,
//       error: error.message || "Internal Server Error",
//     });
//   }
// };

import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Company } from "../models/company.model.js";
import { Candidates } from "../models/Candidate.model.js";

export const jwtsec = "abxy";

export const adduser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, Email and Password are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
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

    console.log("User created with ID:", user._id);

    if (user.role === "company") {
      try {
        const company = await Company.create({
          ownerId: user._id,
          companyName: user.username,
          email: user.email,
        });
        console.log("Company profile created with ID:", company._id);
      } catch (err) {
        console.error("Failed to create Company profile:", err.message);
        await User.findByIdAndDelete(user._id);
        return res.status(500).json({
          success: false,
          message: "Failed to create company profile. Please try again.",
        });
      }
    } else if (user.role === "candidate") {
      try {
        const candidate = await Candidates.create({
          userId: user._id,
          fullName: user.username,
          email: user.email,
        });
        console.log("Candidate profile created with ID:", candidate._id);
      } catch (err) {
        console.error("Failed to create Candidate profile:", err.message);
        await User.findByIdAndDelete(user._id);
        return res.status(500).json({
          success: false,
          message: "Failed to create candidate profile. Please try again.",
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and Password are required",
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({
        success: false,
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
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};