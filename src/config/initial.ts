import cors from "cors";
import { config } from "dotenv";
import express from "express";
import expressWs from "express-ws";
import morgan from "morgan";

config();

export const PORT: number = Number(process.env.PORT!) || 5555;
export const HOST: string = process.env.HOST || "0.0.0.0";

const app = express();

export const { app: appWS } = expressWs(app);
export const wsInstance = expressWs(appWS);

app.use(express.json());
app.use(cors());

app.use(morgan("dev"));

export { app as configApp };
