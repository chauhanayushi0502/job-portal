import { Router } from "express";
import userRouter from "./user.router.js";
import companyRouter from "./company.router.js";
import candidateRouter from "./candidate.router.js";
import jobRouter from "./job.router.js";
import applicationRouter from "./application.router.js"
import notificationRouter from "./notification.routers.js";
const appRouter = Router();
appRouter.use("/user", userRouter);
appRouter.use("/company",companyRouter);
appRouter.use("/candidate",candidateRouter);
appRouter.use("/job",jobRouter);
appRouter.use("/application",applicationRouter);
appRouter.use("/notification",notificationRouter);

export default appRouter;
