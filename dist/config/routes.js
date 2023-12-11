"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainRouter = void 0;
const express_1 = require("express");
const routes_1 = require("../routes");
const router = (0, express_1.Router)();
exports.MainRouter = router;
router.use("/board", routes_1.BoardRouter);
router.use("/user", routes_1.UserRouter);
