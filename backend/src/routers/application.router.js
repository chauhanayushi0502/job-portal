import { Router } from "express";
import { applyjob, applyhistory } from "../controllers/application.controller.js";
import { authentication } from "../middleware/authentication.js";

const applicationRouter = Router();

applicationRouter.post("/applyjob", authentication, applyjob);
applicationRouter.get("/applyhistory", authentication, applyhistory);

export default applicationRouter;