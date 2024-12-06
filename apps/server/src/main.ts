import dotenv from "dotenv";
import "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import compression from "compression";
import { ErrorHandler } from "./middleware/error.handler";
import { authRouter } from "./routes/auth.routes";
import { env } from "./lib/env";
import { logger } from "./utils/logger";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.get("/", (req: Request, res: Response) => {
  res.json({ msg: "Hello! Weleome to monorepo server" });
});

const PORT = env.PORT;
const _path = process.env.BASE_PATH;

logger.info("Hello ");

app.use(`${_path}/auth`, authRouter);
app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log("Server listening on Port: " + PORT);
});
