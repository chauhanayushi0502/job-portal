import { Router } from "express";
import {getnotifications} from "../controllers/notification.controller.js";
import {authentication} from "../middleware/authentication.js"

const notificationRouter = Router();
notificationRouter.get("/getnotifications",authentication,getnotifications);


export default notificationRouter;
