import { Router } from "express";
import { auth } from "../middlewares/auth";
import { BoardController } from "../controllers/board";

const router = Router();
const boardController = new BoardController();

// get routes
router.get("/", auth, boardController.getAll);
router.get("/my", auth, boardController.my);
router.get("/new", auth, boardController.start);
router.get("/:id", auth, boardController.getByID);

// put routes
router.put("/saved/:id", auth, boardController.join);
router.put("/move/:id", auth, boardController.move);

export default router;
