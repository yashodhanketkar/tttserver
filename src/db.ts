import { config } from "dotenv";
import mongoose from "mongoose";

config();
const DB_URI = process.env.DB_URI;
if (!DB_URI) throw new Error("Database configuration failed");

export const mongoConnection = async () => {
  return mongoose
    .connect(DB_URI)
    .then(() => console.log("Database is Connected"))
    .catch((err: Error) => console.log("Please Restart Server", err));
};
