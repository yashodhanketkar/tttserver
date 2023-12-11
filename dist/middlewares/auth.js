"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
(0, dotenv_1.config)();
const TOKEN = process.env.TOKEN;
if (!TOKEN)
    throw new Error("Incorrect otken provided");
const Auth = (req, res, next) => {
    var _a;
    const token = ((_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || req.query.token;
    if (!token) {
        return res
            .status(401)
            .json({ message: "Access denied. No token provided." });
    }
    try {
        if (typeof token !== "string")
            throw new Error("Incorrect token is provided");
        const decoded = jsonwebtoken_1.default.verify(token, TOKEN);
        req.body.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token." });
    }
};
exports.Auth = Auth;
