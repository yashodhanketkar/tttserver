import cors from "cors";
import express, { Request, Response } from "express";
import expressWs from "express-ws";
import morgan from "morgan";
import { mongoConnection } from "./db";
import { MainRouter } from "./routes";

const app = express();

const { app: appWS } = expressWs(app);
export const wsInstance = expressWs(appWS);

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

mongoConnection();

appWS.ws("/", (ws: any) => {
  ws.on("message", (msg: string, req: Request, res: Response) => {
    console.log(msg);
    const wsClients = wsInstance.getWss().clients;
    wsClients.forEach((client) => {
      client.send("Hello");
    });
  });
});

app.use("/api", MainRouter);

app.listen(5555, "0.0.0.0", () => {
  console.log("Server is running");
});
