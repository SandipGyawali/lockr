import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import compression from "compression";
import { HTTPStatusCode } from "./utils/status.code";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.get("/", (req: Request, res: Response) => {
  res.json("Hello! Weleome to monorepo server");
});

const PORT = process.env.PORT || 8001;

app.use((err: any, req: Request, res: Response) => {
  const statusCode = err.status || HTTPStatusCode.InternalServerError;
  console.error(err);

  return res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }), //include stack trace
  });
});

app.listen(PORT, () => {
  console.log("Server listening on Port: " + PORT);
});
