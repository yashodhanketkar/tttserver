import express, { Request, Response } from "express";
import { mongoConnection } from "./config/db";
import { HOST, PORT, appWS, configApp, wsInstance } from "./config/initial";
import { MainRouter } from "./routes";

// exporting from here for ease of access
export { wsInstance };
export const app = express();

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
