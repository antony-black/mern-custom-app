import jwt from "jsonwebtoken";
import Token from "../models/token-model";
import { env } from "../utils/env";

export const generateTokens = async (payload: any) => {
  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: "20s" });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "30s" });

  return {
    accessToken,
    refreshToken,
  };
};

// TODO: this approach work if user login just from a single device.
// To uset it for multiple device, it should be rewokred
export const save = async (userId: string, refreshToken: string) => {
  const tokenData = await Token.findOne({ _id: userId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }

  const token = await Token.create({ userId, refreshToken });
  return token;
};

export const validateAccessToken = async (token: string) => {
  try {
    const userData = jwt.verify(token, env.JWT_ACCESS_SECRET);
    return userData;
  } catch (error) {
    return null;
  }
};

export const validateRefreshToken = async (token: string) => {
  try {
    const userData = jwt.verify(token, env.JWT_REFRESH_SECRET);
    return userData;
  } catch (error) {
    return null;
  }
};

export const find = async (refreshToken: string) => {
  const tokenData = await Token.findOne({ refreshToken });
  return tokenData;
};

export const remove = async (refreshToken: string) => {
  const token = await Token.deleteOne({ refreshToken });
  return token;
};
