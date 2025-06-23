import path from "path";

import dotenv from "dotenv";
import express from "express";

import { connectDB } from "./config/db";

import router from "./routes/products-routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json()); // allows us to accept JSON data in the req.body
app.use("/api/products/", router);

if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(__dirname, "../frontend/dist");

  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Running on ${PORT}`);
});
// uSLCRsVaQQ49Hh1t
