// import path from 'path';

import dotenv from "dotenv";
import express from "express";

import { connectDB } from "./config/db";

import router from "./routes/products-routes";
// import Product from "./models/product-model";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// const __dirname = path.resolve();

app.use(express.json()); // allows us to accept JSON data in the req.body
app.use("/api/products/", router);

app.listen(PORT, () => {
  connectDB();
  console.log(`Running on ${PORT}`);
});
// uSLCRsVaQQ49Hh1t
