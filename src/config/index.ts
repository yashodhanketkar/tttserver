import cors from "cors";
import { config } from "dotenv";
import express, { json } from "express";
import expressWs from "express-ws";
import mongoose from "mongoose";
import morgan from "morgan";

config();

const app = express();
app.use(json());
app.use(cors());
app.use(morgan("combined"));

// loading env variables with fallback values
const DB_URI = process.env.DB_URI;
export const PORT: number = Number(process.env.PORT!) || 5555;
export const HOST: string = process.env.HOST || "0.0.0.0";

export const { app: appWS } = expressWs(app);
export const wsInstance = expressWs(appWS);

if (!DB_URI) throw new Error("Incorrect DB setup");
export const mongoConnection = async () => {
  return mongoose
    .connect(DB_URI)
    .then(() => console.log("Database is Connected"))
    .catch((err: Error) => console.log("Please Restart Server", err));
};

export { MainRouter } from "./routes";
export { app as configApp };
