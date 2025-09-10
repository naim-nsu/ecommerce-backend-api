import jwt from "jsonwebtoken";

import config from "@/configs";

import { Types } from "mongoose";

export const generateAccessToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.jwtAccessSecret, {
    expiresIn: config.accessTokenExpiry,
    subject: "accessToken",
  });
};

export const generateRefreshToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.jwtRefreshSecret, {
    expiresIn: config.refreshTokenExpiry,
    subject: "refreshToken",
  });
};
