import Router from "express";
import categoryRouter from "./category-router";
import noteRouter from "./note-router";
import userRouter from "./user-router";

const apiRouter = Router();

apiRouter.use('/users', userRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/notes', noteRouter);

export default apiRouter;