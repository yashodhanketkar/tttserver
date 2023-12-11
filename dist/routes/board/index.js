"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
exports.BoardRouter = router;
const boardController = new controller_1.BoardController();
// get routes
router.get("/", [auth_1.Auth], boardController.getAll);
router.get("/my", [auth_1.Auth], boardController.my);
router.get("/new", [auth_1.Auth], boardController.start);
router.get("/:id", [auth_1.Auth], boardController.getByID);
// put routes
router.put("/saved/:id", [auth_1.Auth], boardController.join);
router.put("/move/:id", [auth_1.Auth], boardController.move);
