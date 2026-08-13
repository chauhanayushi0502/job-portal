import { Router } from "express";
import { getAllJobs, getJobById } from "../controllers/job.controllers.js";
import { authentication } from "../middleware/authentication.js";

const jobRouter = Router();

jobRouter.get("/getalljob", authentication, getAllJobs);
jobRouter.get("/:id", authentication, getJobById);

export default jobRouter;