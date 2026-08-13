import { Router } from "express";
import { 
  getCandidateProfile, 
  updateCandidateProfile,
  checkProfileComplete 
} from "../controllers/candidate.controller.js";
import { authentication } from "../middleware/authentication.js";

const candidateRouter = Router();

candidateRouter.get("/getcandidate", authentication, getCandidateProfile);
candidateRouter.put("/updatecandidate", authentication, updateCandidateProfile);
candidateRouter.get("/checkprofile", authentication, checkProfileComplete);

export default candidateRouter;