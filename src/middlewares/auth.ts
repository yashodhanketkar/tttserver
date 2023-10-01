import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

config();
const TOKEN = process.env.TOKEN;
if (!TOKEN) throw new Error("Incorrect otken provided");

export const Auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1] || req.query.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  try {
    if (typeof token !== "string")
      throw new Error("Incorrect token is provided");
    const decoded = jwt.verify(token, TOKEN);
    req.body.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};
