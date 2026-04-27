import { type Response } from "express";
import { type AuthRequest } from "../middlewares/auth";
import Board from "tictactoe-board";
import { WebScoketHelper } from "../helpers/ws";
import { BoardModel } from "../model/board";
import { UserModel } from "../model/user";
import { Types } from "mongoose";

const boardStatus = (board: Board) => {
  return {
    grid: board.grid,
    currentMark: board.currentMark(),
    isDraw: board.isGameDraw(),
    hasWinner: board.hasWinner(),
    isGameOver: board.isGameOver(),
  };
};

const addWin = async (player?: unknown) =>
  await UserModel.findByIdAndUpdate(player, { $inc: { win: 1, played: 1 } });

const addLoss = async (player: unknown) =>
  await UserModel.findByIdAndUpdate(player, { $inc: { loss: 1, played: 1 } });

const addDraw = async (player: unknown) =>
  await UserModel.findByIdAndUpdate(player, { $inc: { draw: 1, played: 1 } });

export class BoardController {
  start = async (req: AuthRequest, res: Response) => {
    const key = Math.random().toString(36).substring(2, 7);

    const board = new Board();
    const initialStatus = boardStatus(board);

    const newBoard = await BoardModel.create({
      ...initialStatus,
      startedBy: new Types.ObjectId(req.userId),
      key,
    });
    return res.status(201).json(newBoard);
  };

  join = async (req: AuthRequest, res: Response) => {
    const id = new Types.ObjectId(req.params.id as string);
    const userId = new Types.ObjectId(req.userId);
    const { key } = req.body;
    const dbBoard = await BoardModel.findById(id);
    if (!dbBoard)
      return res.status(404).json({ message: "Incorrect board number" }).end();
    if (key !== dbBoard.key) return res.status(500).end();
    if (
      dbBoard.startedBy.toString() !== userId.toString() &&
      !dbBoard.against
    ) {
      await BoardModel.findByIdAndUpdate(id, {
        $set: { against: userId },
        $inc: { numberOfPlayers: 1 },
      });
      await WebScoketHelper.sender(
        JSON.stringify({
          message: "Player two joined",
        }),
      );
    }
    const board = new Board(dbBoard.grid);
    return res.status(201).json({
      status: boardStatus(board),
    });
  };

  myBoards = async (req: AuthRequest, res: Response) => {
    const id = new Types.ObjectId(req.userId);
    const boards = (
      await BoardModel.find({
        $or: [{ against: id }, { startedBy: id }],
      })
    )
      .filter((ele) => ele.isDraw === false && ele.hasWinner === false)
      .map((ele) => ele._id);
    return res.json(boards);
  };

  getByID = async (req: AuthRequest, res: Response) => {
    try {
      const id = new Types.ObjectId(req.params.id as string);
      const dbBoard = await BoardModel.findOne({ _id: id });
      if (dbBoard) return res.status(200).json(dbBoard);
      else return res.status(404).end();
    } catch (err) {
      return res.status(500).end();
    }
  };

  move = async (req: AuthRequest, res: Response) => {
    let board: Board;
    const id = new Types.ObjectId(req.userId);
    const dbBoard = await BoardModel.findById(id);
    if (!dbBoard)
      return res.status(404).json({ message: "Board not found" }).end();
    board = new Board(dbBoard.grid);
    const { index } = req.body;

    if (board.isPositionTaken(index)) {
      return res.status(400).json({
        message: "Illegal move - Not allowed",
        status: boardStatus(board),
      });
    }

    const mark = board.currentMark();

    if (
      (mark === "X" && dbBoard.startedBy !== id) ||
      (mark === "O" && dbBoard.against !== id)
    )
      return res
        .status(400)
        .json({
          message: "Illegal move - Out of turn",
          status: boardStatus(board),
        })
        .end();

    board = board.makeMove(index, mark);
    await BoardModel.findByIdAndUpdate(dbBoard._id, {
      $set: { ...boardStatus(board) },
    });

    if (board.hasWinner()) {
      if (board.winningPlayer() === "X") {
        await addWin(dbBoard.startedBy);
        await addLoss(dbBoard.against);
        await BoardModel.findByIdAndUpdate(dbBoard._id, {
          $set: { winner: dbBoard.startedBy },
        });
      } else {
        await addLoss(dbBoard.startedBy);
        await addWin(dbBoard.against);
        await BoardModel.findByIdAndUpdate(dbBoard._id, {
          $set: { winner: dbBoard.against },
        });
      }
      await WebScoketHelper.sender(
        JSON.stringify({
          status: boardStatus(board),
        }),
      );
      return res
        .status(200)
        .json({ message: `Player ${board.winningPlayer()}` });
    }

    if (board.isGameDraw()) {
      await addDraw(dbBoard.startedBy);
      await addDraw(dbBoard.against);
      await WebScoketHelper.sender(
        JSON.stringify({
          status: boardStatus(board),
        }),
      );
    }

    const status = boardStatus(board);
    await WebScoketHelper.sender(
      JSON.stringify({
        _id: dbBoard._id,
        grid: status.grid,
      }),
    );
    return res.status(200).json(status);
  };

  getAll = async (_req: AuthRequest, res: Response) => {
    const boards = await BoardModel.find()
      .populate("against", "username")
      .populate("startedBy", "username")
      .populate("winner", "username");
    return res.status(200).json([...boards]);
  };

  my = async (req: AuthRequest, res: Response) => {
    const id = new Types.ObjectId(req.userId);
    const boards = await BoardModel.find({
      $or: [{ against: id }, { startedBy: id }],
    });
    return res.status(200).json({ boards });
  };
}
