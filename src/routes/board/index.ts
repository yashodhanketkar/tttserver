import { Router } from "express";
import { Auth } from "../../middlewares/auth";
import { BoardController } from "./controller";

const router = Router();
const boardController = new BoardController();

// get routes
router.get("/", boardController.getAll);
router.get("/my", [Auth], boardController.my);
router.get("/new", [Auth], boardController.start);
router.get("/:id", boardController.getByID);

// put routes
router.put("/saved/:id", [Auth], boardController.join);
router.put("/move/:id", [Auth], boardController.move);

export { router as BoardRouter };
