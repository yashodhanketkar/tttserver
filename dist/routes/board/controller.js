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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardController = void 0;
const tictactoe_board_1 = __importDefault(require("tictactoe-board"));
const ws_1 = require("../../helpers/ws");
const board_1 = require("../../model/board");
const user_1 = require("../../model/user");
const boardStatus = (board) => {
    return {
        grid: board.grid,
        currentMark: board.currentMark(),
        isDraw: board.isGameDraw(),
        hasWinner: board.hasWinner(),
        isGameOver: board.isGameOver(),
    };
};
const addWin = (player) => __awaiter(void 0, void 0, void 0, function* () { return yield user_1.UserModel.findByIdAndUpdate(player, { $inc: { win: 1, played: 1 } }); });
const addLoss = (player) => __awaiter(void 0, void 0, void 0, function* () { return yield user_1.UserModel.findByIdAndUpdate(player, { $inc: { loss: 1, played: 1 } }); });
const addDraw = (player) => __awaiter(void 0, void 0, void 0, function* () { return yield user_1.UserModel.findByIdAndUpdate(player, { $inc: { draw: 1, played: 1 } }); });
class BoardController {
    constructor() {
        this.start = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const board = new tictactoe_board_1.default();
            const key = Math.random().toString(36).substring(2, 7);
            return res.status(201).json(yield board_1.BoardModel.create(Object.assign(Object.assign({}, boardStatus(board)), { startedBy: req.body.user._id, key })));
        });
        this.join = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { key } = req.body;
            const dbBoard = yield board_1.BoardModel.findById(id);
            if (!dbBoard)
                return res.status(404).json({ message: "Incorrect board number" }).end();
            if (key !== dbBoard.key)
                return res.status(500).end();
            if (dbBoard.startedBy !== req.body.user._id && !dbBoard.against) {
                yield board_1.BoardModel.findByIdAndUpdate(id, {
                    $set: {
                        against: req.body.user._id,
                    },
                    $inc: {
                        numberOfPlayers: 1,
                    },
                });
                yield ws_1.WebScoketHelper.sender(JSON.stringify({
                    message: "Player two joined",
                }));
            }
            const board = new tictactoe_board_1.default(dbBoard.grid);
            return res.status(201).json({
                status: boardStatus(board),
            });
        });
        this.myBoards = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const boards = (yield board_1.BoardModel.find({ user: req.body.user }))
                .filter((ele) => ele.isDraw === false && ele.hasWinner === false)
                .map((ele) => ele._id);
            return res.json(boards);
        });
        this.getByID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dbBoard = yield board_1.BoardModel.findById(req.params.id)
                    .populate("against", "username")
                    .populate("startedBy", "username");
                if (dbBoard)
                    return res.status(200).json(dbBoard);
                else
                    return res.status(404).end();
            }
            catch (err) {
                console.log(err);
                return res.status(500).end();
            }
        });
        this.move = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let board;
            const dbBoard = yield board_1.BoardModel.findById(req.params.id);
            if (!dbBoard)
                return res.status(404).json({ message: "Board not found" }).end();
            board = new tictactoe_board_1.default(dbBoard.grid);
            const { index } = req.body;
            if (board.isPositionTaken(index)) {
                return res.status(400).json({
                    message: "Illegal move - Not allowed",
                    status: boardStatus(board),
                });
            }
            const mark = board.currentMark();
            if ((mark === "X" && String(dbBoard.startedBy) !== req.body.user._id) ||
                (mark === "O" && String(dbBoard.against) !== req.body.user._id))
                return res
                    .status(400)
                    .json({
                    message: "Illegal move - Out of turn",
                    status: boardStatus(board),
                })
                    .end();
            board = board.makeMove(index, mark);
            yield board_1.BoardModel.findByIdAndUpdate(dbBoard._id, {
                $set: Object.assign({}, boardStatus(board)),
            });
            if (board.hasWinner()) {
                if (board.winningPlayer() === "X") {
                    yield addWin(dbBoard.startedBy);
                    yield addLoss(dbBoard.against);
                    yield board_1.BoardModel.findByIdAndUpdate(dbBoard._id, {
                        $set: { winner: dbBoard.startedBy },
                    });
                }
                else {
                    yield addLoss(dbBoard.startedBy);
                    yield addWin(dbBoard.against);
                    yield board_1.BoardModel.findByIdAndUpdate(dbBoard._id, {
                        $set: { winner: dbBoard.against },
                    });
                }
                yield ws_1.WebScoketHelper.sender(JSON.stringify({
                    status: boardStatus(board),
                }));
                return res
                    .status(200)
                    .json({ message: `Player ${board.winningPlayer()}` });
            }
            if (board.isGameDraw()) {
                yield addDraw(dbBoard.startedBy);
                yield addDraw(dbBoard.against);
                yield ws_1.WebScoketHelper.sender(JSON.stringify({
                    status: boardStatus(board),
                }));
            }
            const status = boardStatus(board);
            yield ws_1.WebScoketHelper.sender(JSON.stringify({
                _id: dbBoard._id,
                grid: status.grid,
            }));
            return res.status(200).json(status);
        });
        this.getAll = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            const boards = yield board_1.BoardModel.find()
                .populate("against", "username")
                .populate("startedBy", "username")
                .populate("winner", "username");
            return res.status(200).json([...boards]);
        });
        this.my = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userID = req.body.user._id;
            const boards = yield board_1.BoardModel.find({
                $or: [{ against: userID }, { startedBy: userID }],
            });
            return res.status(200).json({ boards });
        });
    }
}
exports.BoardController = BoardController;
