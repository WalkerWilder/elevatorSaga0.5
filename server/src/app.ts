import { Request, Response } from "express";

const express = require("express");

const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
console.log(process.env.CORS_ORIGIN || "*");

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

app.use(helmet());

app.use(express.json());

app.use(morgan("dev"));

app.post("/gameUpdate", (req: Request, res: Response, next: () => void) => {
  console.log(req.body);
  res.json({ status: "OK" });
});

module.exports = app;
