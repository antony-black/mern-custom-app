import bcrypt from "bcrypt";
import User from "../models/user-model";
import { generateTokens, remove, save } from "./token-service";

export const registrationService = async (name: string, email: string, password: string) => {
  const isUserExisted = await User.findOne({ email });
  if (isUserExisted) {
    throw new Error(`User has been already registred by this email: ${email}. Please, login.`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  const tokens = await generateTokens({ ...user });
  await save(user.id, tokens.refreshToken);

  return { ...tokens, user };
};

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  const isEqualedPasswords = await bcrypt.compare(password, user?.password ?? "");
  if (!user || !isEqualedPasswords) {
    throw new Error("Wrong email or password.");
  }

  const tokens = await generateTokens({ ...user });
  await save(user.id, tokens.refreshToken);

  return { ...tokens, user };
};

export const logoutService = async (refreshToken: string) => {
  const token = remove(refreshToken);

  return token;
};