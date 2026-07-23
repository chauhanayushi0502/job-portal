import { Router } from "express";
import { addjob, getjobs, updatejob ,deletejob, getalljob} from "../controllers/job.controllers.js";
import { authentication } from "../middleware/authentication.js";

const jobRouter = Router();
jobRouter.post("/addjob",authentication,addjob);
jobRouter.get("/getjobs",authentication,getjobs);
jobRouter.post("/updatejob",authentication,updatejob);
jobRouter.get("/getalljob",getalljob);
jobRouter.delete("/deletejob",authentication,deletejob);

export default jobRouter;
