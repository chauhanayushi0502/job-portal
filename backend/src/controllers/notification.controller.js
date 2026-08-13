import { Notification } from "../models/Notification.model.js";

export const createNotification = async (
  recipientId,
  recipientRole,
  title,
  message,
  type = "general",
  relatedId = null,
  relatedModel = null
) => {
  try {
    if (!recipientId || !recipientRole || !title || !message) {
      throw new Error("Missing required fields for notification");
    }

    const notification = await Notification.create({
      recipientId,
      recipientRole,
      title,
      message,
      type,
      relatedId,
      relatedModel,
      isRead: false,
      createdAt: new Date(),
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    await Notification.updateMany(
      { recipientId: userId, recipientRole: userRole, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};