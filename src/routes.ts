import { Router } from "express";
import { BoardRouter } from "./routes/board";
import { UserRouter } from "./routes/user";

const router = Router();
const socketRouter = Router();

router.use("/board", BoardRouter);
router.use("/user", UserRouter);

export { router as MainRouter };
