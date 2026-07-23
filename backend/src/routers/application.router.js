import { Router } from "express";
import { applyjob ,applyhistory,history,select} from "../controllers/application.controller.js";
import { authentication } from "../middleware/authentication.js";
import { upload } from "../middleware/multer.middleware.js";
const applicationRouter = Router();
applicationRouter.post("/applyjob",authentication,applyjob);
applicationRouter.get("/applyhistory",authentication,applyhistory);
applicationRouter.get("/history",authentication,history);
applicationRouter.post("/select",authentication,select)
// applicationRouter.post("/myapplications",authentication,myapplications);

export default applicationRouter;
