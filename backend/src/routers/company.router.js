import { Router } from "express";
import { addcompany, getcompany, updatecompany } from "../controllers/company.controller.js";
import { authentication } from "../middleware/authentication.js";

const companyRouter = Router();
companyRouter.post("/addcompany",authentication,addcompany);
companyRouter.put("/updatecompany",authentication,updatecompany);
companyRouter.get("/getcompany",authentication,getcompany);

export default companyRouter;
