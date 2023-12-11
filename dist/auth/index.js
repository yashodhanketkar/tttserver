"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = exports.verifyPass = exports.hashPass = void 0;
const bcrypt_1 = require("bcrypt");
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = require("jsonwebtoken");
(0, dotenv_1.config)();
const TOKEN = process.env.TOKEN;
if (!TOKEN)
    throw new Error("Token not found");
const hashPass = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, bcrypt_1.hash)(password, yield (0, bcrypt_1.genSalt)(10));
});
exports.hashPass = hashPass;
const verifyPass = (password, dbPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, bcrypt_1.compare)(password, dbPassword);
});
exports.verifyPass = verifyPass;
const getToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user._id)
        throw new Error("User not found");
    return [
        (0, jsonwebtoken_1.sign)({ _id: user._id, username: user.username }, TOKEN, {
            expiresIn: "7d",
        }),
    ];
});
exports.getToken = getToken;
