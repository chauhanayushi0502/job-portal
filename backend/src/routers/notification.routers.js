import { Router } from "express";
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead 
} from "../controllers/notification.controller.js";
import { authentication } from "../middleware/authentication.js";

const notificationRouter = Router();

notificationRouter.use(authentication);

notificationRouter.get("/getnotifications", getNotifications);
notificationRouter.put("/markread/:notificationId", markAsRead);
notificationRouter.put("/markallread", markAllAsRead);

export default notificationRouter;