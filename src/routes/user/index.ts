import { Router } from "express";
import { Auth } from "../../middlewares/auth";
import { UserController } from "./controller";

const router = Router();
const userController = new UserController();

// get routes
router.get("/me", [Auth], userController.me);
router.get("/stats", [Auth], userController.stats);
router.get("/stats/:id", [Auth], userController.statsByID);

// post routes
router.post("/register", userController.register);
router.post("/login", userController.login);

export { router as UserRouter };
