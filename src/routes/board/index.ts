import { Router } from "express";
import { Auth } from "../../middlewares/auth";
import { BoardController } from "./controller";

const router = Router();
const boardController = new BoardController();

router.get("/", boardController.getAll);
router.get("/new", [Auth], boardController.newStart);
router.get("/my", [Auth], boardController.getMy);
router.get("/:id", boardController.status);
router.put("/saved/:id", [Auth], boardController.coldStart);
router.put("/move/:id", [Auth], boardController.move);

export { router as BoardRouter };
