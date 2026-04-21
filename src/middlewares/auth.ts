import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

config();
const TOKEN = process.env.TOKEN;
if (!TOKEN) throw new Error("Incorrect secrete provided");

export interface AuthRequest extends Request {
  userId?: string;
  userName?: string;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied." });

  try {
    const decoded = jwt.verify(token, TOKEN) as {
      _id: string;
      username: string;
    };
    req.userId = decoded._id;
    req.userName = decoded.username;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};
