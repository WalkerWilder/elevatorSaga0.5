import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { Routes } from "../routes";
// import apiRoutes from './routes/apiRoutes';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

app.use(helmet());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(morgan("dev"));

app.post(
  "/game/:id/update",
  (req: Request, res: Response, next: () => void) => {
    console.log(req.query);
    res.json({ status: "OK" });
  }
);

const a = new Routes().list();
console.log(a);

// Rotas da API
// app.use('/api', apiRoutes);

export default app;
