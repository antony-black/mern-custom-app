import { Request, Response, NextFunction } from "express";
import { loginService, registrationService } from "../services/user-service";

export const registration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const userData = await registrationService(name, email, password);

    res.json(userData);
  } catch (error) {
    if (error instanceof Error) {
      console.error("UserController/registration: ", error.message);
      next(error);
    }
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const userData = await loginService(email, password);

    res.json(userData);
  } catch (error) {
    if (error instanceof Error) {
      console.error("UserController/login: ", error.message);
      next(error);
    }
  }
};
