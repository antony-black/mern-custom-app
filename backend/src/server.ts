// import path from 'path';

import dotenv from "dotenv";
import express from "express";

import { connectDB } from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// const __dirname = path.resolve();

app.use(express.json());

app.get("/", (req, res) => {
  res.json("hello");
});

app.listen(PORT, () => {
  connectDB();
  console.log("Running on 3001");
});
// uSLCRsVaQQ49Hh1t
