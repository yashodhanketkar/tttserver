import { Router } from "express";
import { UserController } from "../controllers/user";
import { auth } from "../middlewares/auth";

const router = Router();
const userController = new UserController();

// get routes
router.get("/me", auth, userController.me);
router.get("/stats", auth, userController.stats);
router.get("/stats/:id", auth, userController.statsByID);

// post routes
router.post("/register", userController.register);
router.post("/login", userController.login);

export default router;
