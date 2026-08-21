import { Router } from "express";
import { 
  addcompany, 
  getcompany, 
  updatecompany,
  getCompanyJobs,
  getJobApplicationsForCompany,
  updateApplicationStatus,
  inviteCandidate,
  getCompanyNotifications,
  markAsRead,
  markAllAsRead
} from "../controllers/company.controller.js";
import { authentication } from "../middleware/authentication.js";
import { addjob, updatejob, deletejob } from "../controllers/job.controllers.js";

const companyRouter = Router();

companyRouter.post("/addcompany", authentication, addcompany);
companyRouter.get("/getcompany", authentication, getcompany);
companyRouter.put("/updatecompany", authentication, updatecompany);
companyRouter.get("/myjobs", authentication, getCompanyJobs);
companyRouter.post("/addjob", authentication, addjob);
companyRouter.put("/updatejob/:id", authentication, updatejob);
companyRouter.delete("/deletejob/:id", authentication, deletejob);
companyRouter.get("/applications/:jobId", authentication, getJobApplicationsForCompany);
companyRouter.put("/application/:appId", authentication, updateApplicationStatus);
companyRouter.post("/invite", authentication, inviteCandidate);
companyRouter.get("/notifications", authentication, getCompanyNotifications);
companyRouter.put("/markread/:notificationId",authentication,markAsRead)
companyRouter.put("/markallread",authentication, markAllAsRead);
export default companyRouter;