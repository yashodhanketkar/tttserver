"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    played: {
        type: Number,
        default: 0,
    },
    win: {
        type: Number,
        default: 0,
    },
    loss: {
        type: Number,
        default: 0,
    },
    draw: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
