"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
exports.UserRouter = router;
const userController = new controller_1.UserController();
// get routes
router.get("/me", [auth_1.Auth], userController.me);
router.get("/stats", [auth_1.Auth], userController.stats);
router.get("/stats/:id", [auth_1.Auth], userController.statsByID);
// post routes
router.post("/register", userController.register);
router.post("/login", userController.login);
