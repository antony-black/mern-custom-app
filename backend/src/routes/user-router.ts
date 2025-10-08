import express from "express";
import { login, registration } from "../controllers/user-controller";

const userRouter = express.Router();

userRouter.post("/registration", registration);
userRouter.post("/login", login);

export default userRouter;
