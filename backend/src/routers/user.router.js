import { Router } from "express";
import {adduser,login,updateuser} from "../controllers/user.controller.js"
import { authentication } from "../middleware/authentication.js";

const userRouter = Router();
userRouter.post("/adduser", adduser);
userRouter.post("/login",login);
userRouter.put("/update",authentication,updateuser)

export default userRouter;
