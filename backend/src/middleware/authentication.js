import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const jwtsec = "abxy";

export const authentication = async (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is required",
      });
    }

    const decoded = jwt.verify(token, jwtsec);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};