import { Router } from "express";
import { adduser, login } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/register", adduser);
userRouter.post("/login", login);

export default userRouter;