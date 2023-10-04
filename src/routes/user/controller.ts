import { Request, Response } from "express";
import { decode, sign, verify } from "jsonwebtoken";
import { getToken, hashPass, verifyPass } from "../../auth";
import { BoardModel } from "../../model/board";
import { UserModel } from "../../model/user";

export class UserController {
  create = async (req: Request, res: Response) => {
    try {
      const user = await UserModel.create({
        ...req.body,
        password: await hashPass(req.body.password),
      });
      return res
        .status(201)
        .json({ user: user.username, message: "User created" });
    } catch (err) {
      return res.status(500).json({ message: "Error creating new user" }).end();
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      console.log(req);
      const user = await UserModel.findOne({ username: req.body.username });
      if (!user)
        return res.status(401).json({ message: "Invalid credentials" }).end();
      if (!(await verifyPass(req.body.password, user.password)))
        return res.status(401).json({ message: "Invalid credentials" }).end();
      const token = await getToken({
        _id: String(user._id),
        username: user.username,
      });
      return res.json({ message: `Welcome ${user.username}`, token });
    } catch (err) {
      return res.status(500).end();
    }
  };

  me = async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.body.user._id);
    if (!user) return res.status(401).end();
    return res.json({ id: user._id, username: user.username });
  };

  status = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).end();
    const winRate = user.win / user.played;
    const lossRate = user.loss / user.played;
    const drawRate = user.draw / user.played;
    const boards = (
      await BoardModel.find({
        $or: [{ startedBy: id }, { against: id }],
      }).populate("winner", "username")
    ).map((board) => {
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
  };

  statsAll = async (_req: Request, res: Response) => {
    try {
      const users = (await UserModel.find()).map((user) => {
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
    } catch (err) {
      console.log((err as Error).message);
      return res.status(500).end();
    }
  };
}
