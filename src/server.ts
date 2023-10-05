import express, { Request, Response } from "express";
import expressWs from "express-ws";
import { HOST, MainRouter, PORT, configApp, mongoConnection } from "./config";

export const app = express();
export const { app: appWS } = expressWs(app);
export const wsInstance = expressWs(appWS);

// apply configs
app.use(configApp);
mongoConnection();

// logs and returns message recieved by websocket
appWS.ws("/", (ws: any) => {
  ws.on("message", (msg: string, _req: Request, _res: Response) => {
    const wsClients = wsInstance.getWss().clients;
    wsClients.forEach((client) => {
      console.log("WS: ", msg);
      client.send(`Got ${msg}`);
    });
  });
});

app.use("/api", MainRouter);
app.listen(PORT, HOST, () => {
  console.log("Server is running");
});
