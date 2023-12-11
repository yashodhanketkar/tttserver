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
exports.UserController = void 0;
const auth_1 = require("../../auth");
const board_1 = require("../../model/board");
const user_1 = require("../../model/user");
class UserController {
    constructor() {
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.UserModel.create(Object.assign(Object.assign({}, req.body), { password: yield (0, auth_1.hashPass)(req.body.password) }));
                return res
                    .status(201)
                    .json({ user: user.username, message: "User created" });
            }
            catch (err) {
                return res.status(500).json({ message: "Error creating new user" }).end();
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.UserModel.findOne({ username: req.body.username });
                if (!user)
                    return res.status(401).json({ message: "Invalid credentials" }).end();
                if (!(yield (0, auth_1.verifyPass)(req.body.password, user.password)))
                    return res.status(401).json({ message: "Invalid credentials" }).end();
                const token = yield (0, auth_1.getToken)({
                    _id: String(user._id),
                    username: user.username,
                });
                return res.json({ message: `Welcome ${user.username}`, token });
            }
            catch (err) {
                return res.status(500).end();
            }
        });
        this.me = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.UserModel.findById(req.body.user._id);
            if (!user)
                return res.status(401).end();
            return res.json({ id: user._id, username: user.username });
        });
        this.statsByID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield user_1.UserModel.findById(id);
            if (!user)
                return res.status(404).end();
            const winRate = user.win / user.played;
            const lossRate = user.loss / user.played;
            const drawRate = user.draw / user.played;
            const boards = (yield board_1.BoardModel.find({
                $or: [{ startedBy: id }, { against: id }],
            }).populate("winner", "username")).map((board) => {
                return {
                    _id: board._id,
                    isGameOver: board.isGameOver,
                    hasWinner: board.hasWinner,
                    winner: board.winner,
                };
            });
            return res.status(200).json({
                username: user.username,
                games: user.played,
                win: user.win,
                winRate,
                loss: user.loss,
                lossRate,
                draw: user.draw,
                drawRate,
                boards,
            });
        });
        this.stats = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = (yield user_1.UserModel.find()).map((user) => {
                    const winRate = parseFloat((user.win / user.played).toFixed(2));
                    const lossRate = parseFloat((user.loss / user.played).toFixed(2));
                    const drawRate = parseFloat((user.draw / user.played).toFixed(2));
                    return {
                        _id: user._id,
                        username: user.username,
                        games: user.played,
                        win: user.win,
                        winRate,
                        loss: user.loss,
                        lossRate,
                        draw: user.draw,
                        drawRate,
                    };
                });
                return res.status(200).json(users);
            }
            catch (err) {
                console.log(err);
                return res.status(500).end();
            }
        });
    }
}
exports.UserController = UserController;
