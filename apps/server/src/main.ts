import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import compression from "compression";
import { ErrorHandler } from "./middleware/error.handler";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.get("/", (req: Request, res: Response) => {
  res.json("Hello! Weleome to monorepo server");
});

const PORT = process.env.PORT || 8001;

app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log("Server listening on Port: " + PORT);
});
