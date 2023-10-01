import { Router } from "express";
import { BoardRouter } from "./board";
import { UserRouter } from "./user";

const router = Router();

router.use("/board", BoardRouter);
router.use("/user", UserRouter);

export { router as MainRouter };
