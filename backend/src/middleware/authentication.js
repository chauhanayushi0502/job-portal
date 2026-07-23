import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { jwtsec } from "../controllers/user.controller.js";

export const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Token is required",
      });
    }

    const decoded = jwt.verify(token, jwtsec);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      error: error.message || "Invalid Token",
    });
  }
};