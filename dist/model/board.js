"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardModel = void 0;
const mongoose_1 = require("mongoose");
const BoardSchema = new mongoose_1.Schema({
    startedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    against: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    numberOfPlayers: {
        type: Number,
        default: 1,
    },
    key: {
        type: String,
    },
    grid: [
        {
            type: String,
        },
    ],
    currentMark: {
        type: String,
    },
    isGameOver: {
        type: Boolean,
    },
    isDraw: {
        type: Boolean,
    },
    hasWinner: {
        type: Boolean,
    },
    winner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});
exports.BoardModel = (0, mongoose_1.model)("Board", BoardSchema);
