import Router from "express";
import categoryRouter from "./category-router";
import userRouter from "./user-router";

const apiRouter = Router();

apiRouter.use('/users', userRouter);
apiRouter.use('/categories', categoryRouter);

export default apiRouter;