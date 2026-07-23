import { Router } from "express";
import { addcandidate, getcandidate, updatecandidate ,checkProfile} from "../controllers/candidate.controller.js";
import { authentication } from "../middleware/authentication.js";

const candidateRouter = Router();
candidateRouter.post("/addcandidate",authentication,addcandidate);
candidateRouter.put("/updatecandidate",authentication,updatecandidate);
candidateRouter.get("/getcandidate",authentication,getcandidate);
candidateRouter.get("/checkProfile",authentication,checkProfile);

export default candidateRouter;
