import { Request, Response } from "express";
import Board from "tictactoe-board";
import { BoardModel } from "../../model/board";
import { UserModel } from "../../model/user";

const boardStatus = (board: Board) => {
  return {
    grid: board.grid,
    currentMark: board.currentMark(),
    isDraw: board.isGameDraw(),
    hasWinner: board.hasWinner(),
  };
};

const addWin = async (player?: unknown) =>
  await UserModel.findByIdAndUpdate(player, { $inc: { win: 1, played: 1 } });

const addLoss = async (player: unknown) =>
  await UserModel.findByIdAndUpdate(player, { $inc: { loss: 1, played: 1 } });

const addDraw = async (player: unknown) =>
  await UserModel.findByIdAndUpdate(player, { $inc: { draw: 1, played: 1 } });

export class BoardController {
  newStart = async (req: Request, res: Response) => {
    const board = new Board();
    const key = Math.random().toString(36).substring(2, 7);
    return res.status(201).json({
      status: await BoardModel.create({
        ...boardStatus(board),
        startedBy: req.body.user._id,
        key,
      }),
    });
  };

  coldStart = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { key } = req.body;
    const dbBoard = await BoardModel.findById(id);
    if (!dbBoard)
      return res.status(404).json({ message: "Incorrect board number" }).end();
    if (key !== dbBoard.key) return res.status(500).end();
    if (dbBoard.startedBy !== req.body.user._id && !dbBoard.against)
      await BoardModel.findByIdAndUpdate(id, {
        $set: {
          against: req.body.user._id,
        },
      });
    const board = new Board(dbBoard.grid);
    return res.status(201).json({
      status: boardStatus(board),
    });
  };

  myBoards = async (req: Request, res: Response) => {
    const boards = (await BoardModel.find({ user: req.body.user }))
      .filter((ele) => ele.isDraw === false && ele.hasWinner === false)
      .map((ele) => ele._id);
    return res.json(boards);
  };

  status = async (req: Request, res: Response) => {
    try {
      const dbBoard = await BoardModel.findById(req.params.id)
        .populate("against", "username")
        .populate("startedBy", "username");
      if (dbBoard)
        return res.status(200).json({
          status: dbBoard,
        });
      else return res.status(404).end();
    } catch (err) {
      console.log(err);
      return res.status(500).end();
    }
  };

  move = async (req: Request, res: Response) => {
    let board: Board;
    const dbBoard = await BoardModel.findById(req.params.id);
    if (!dbBoard)
      return res.status(404).json({ message: "Board not found" }).end();
    if (dbBoard.key !== req.body.key) return res.status(500).end();
    board = new Board(dbBoard.grid);
    const { index } = req.body;

    if (board.isPositionTaken(index)) {
      return res.status(400).json({
        message: "Illegal move - Not allowed",
        status: boardStatus(board),
      });
    }

    const mark = board.currentMark();
    console.log(mark);
    console.log(req.body.user._id);

    if (
      (mark === "X" && String(dbBoard.startedBy) !== req.body.user._id) ||
      (mark === "O" && String(dbBoard.against) !== req.body.user._id)
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
      } else {
        await addLoss(dbBoard.startedBy);
        await addWin(dbBoard.against);
      }
      return res
        .status(200)
        .json({ message: `Player ${board.winningPlayer()}` });
    }

    if (board.isGameDraw()) {
      await addDraw(dbBoard.startedBy);
      await addDraw(dbBoard.against);
    }

    return res.status(200).json({
      status: boardStatus(board),
    });
  };

  getAll = async (_req: Request, res: Response) => {
    const boards = await BoardModel.find()
      .populate("against", "username")
      .populate("startedBy", "username");
    return res.status(200).json({ boards });
  };

  getMy = async (req: Request, res: Response) => {
    const userID = req.body.user._id;
    const boards = await BoardModel.find({
      $or: [{ against: userID }, { startedBy: userID }],
    });
    return res.status(200).json({ boards });
  };
}
