import { Candidates } from "../models/Candidate.model.js";
import { Notification } from "../models/Notification.model.js";

export const getCandidateProfile = async (req, res) => {
  try {
    const candidate = await Candidates.findOne({ userId: req.user._id });
    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }
    res.status(200).json({ success: true, candidate });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const getCandidateNotifications = async (req, res) => {
  try {
    const candidate = await Candidates.findOne({ userId: req.user._id });
    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    const notifications = await Notification.find({recipientId:req.user._id });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const updateCandidateProfile = async (req, res) => {
  try {
    const candidate = await Candidates.findOneAndUpdate(
      { userId: req.user._id },
      { $set: req.body, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, message: "Profile updated", candidate });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const checkProfileComplete = async (req, res) => {
  try {
    const candidate = await Candidates.findOne({ userId: req.user._id });
    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    const isComplete = !!(
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

    res.status(200).json({ success: true, isComplete, candidate });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,

        recipientId: userId,
      },
      {
        $set: { isRead: true },
      },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    await Notification.updateMany(
      {
        recipientId: userId,
        recipientRole: userRole,
        isRead: false,
      },
      {
        $set: { isRead: true },
      },
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};