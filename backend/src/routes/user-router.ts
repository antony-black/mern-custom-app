import express from "express";
import { login, logout, registration } from "../controllers/user-controller";

const userRouter = express.Router();

userRouter.post("/registration", registration);
userRouter.post("/login", login);
userRouter.post("/logout", logout);


export default userRouter;
