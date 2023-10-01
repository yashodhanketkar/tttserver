import express, { json } from "express";
import { mongoConnection } from "./db";
import { MainRouter } from "./routes";

const app = express();

mongoConnection();
app.use(json());
app.use("/api", MainRouter);

app.listen(5555, () => {
  console.log("Server is running");
});
