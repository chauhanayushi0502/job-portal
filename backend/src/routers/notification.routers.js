import { Router } from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification.controller.js";
import { authentication } from "../middleware/authentication.js";

const notifyRouter = Router();

notifyRouter.use(authentication);

notifyRouter.get("/getnotifications", getNotifications);
notifyRouter.put("/markread/:notificationId", markAsRead);
notifyRouter.put("/markallread", markAllAsRead);

export default notifyRouter;