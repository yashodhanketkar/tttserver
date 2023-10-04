import { Router } from "express";
import { BoardRouter, UserRouter } from "../routes";

const router = Router();

router.use("/board", BoardRouter);
router.use("/user", UserRouter);

export { router as MainRouter };
