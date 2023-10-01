import { Router } from "express";
import { Auth } from "../../middlewares/auth";
import { UserController } from "./controller";

const router = Router();
const userController = new UserController();

router.post("/register", userController.create);
router.post("/login", userController.login);
router.get("/me", [Auth], userController.me);
router.get("/:id", userController.status);

export { router as UserRouter };
