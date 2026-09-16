import { Router } from "express";
import { 
  getCandidateProfile, 
  updateCandidateProfile,
  checkProfileComplete,
  getCandidateNotifications,
  markAsRead,
  markAllAsRead
} from "../controllers/candidate.controller.js";
import { authentication } from "../middleware/authentication.js";

const candidateRouter = Router();
candidateRouter.get("/getCandidateNotifications",authentication,getCandidateNotifications);
candidateRouter.get("/getcandidate", authentication, getCandidateProfile);
candidateRouter.put("/updatecandidate", authentication, updateCandidateProfile);
candidateRouter.get("/checkprofile", authentication, checkProfileComplete);
candidateRouter.put("/markread/:notificationId",authentication,markAsRead)
candidateRouter.put("/markallread",authentication, markAllAsRead);
export default candidateRouter;