import { Request, Response, NextFunction } from "express";
import { loginService, logoutService, registrationService } from "../services/user-service";


export const registration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const userData = await registrationService(name, email, password);

    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 68 * 1000,
      httpOnly: true,
    });

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


    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 68 * 1000,
      httpOnly: true,
    });

    res.json(userData);
  } catch (error) {
    if (error instanceof Error) {
      console.error("UserController/login: ", error.message);
      next(error);
    }
  }
};


export const logout = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;

  const token = await logoutService(refreshToken);
  res.clearCookie("refreshToken");

  res.json(token);
  try {
  } catch (error) {
    console.error("UserController/logout: ", error);
    next(error);
  }
};
