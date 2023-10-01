import { compare, genSalt, hash } from "bcrypt";
import { config } from "dotenv";
import { sign, verify } from "jsonwebtoken";

config();
const TOKEN = process.env.TOKEN;
if (!TOKEN) throw new Error("Token not found");

type User = {
  _id: string;
  username: string;
};

export const hashPass = async (password: string) => {
  return hash(password, await genSalt(10));
};

export const verifyPass = async (password: string, dbPassword: string) => {
  return compare(password, dbPassword);
};

export const getToken = async (user: User) => {
  if (!user._id) throw new Error("User not found");
  return [
    sign({ _id: user._id, username: user.username }, TOKEN, {
      expiresIn: "7d",
    }),
  ];
};
