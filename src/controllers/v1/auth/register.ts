import config from "@/configs";
import Token from "@/models/Token";
import type { IUser } from "@/models/User";
import User from "@/models/User";
import { genUsername } from "@/utils/generateUsername";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt";
import logger from "@/utils/logger";

import type { Request, Response } from "express";

type UserData = Pick<IUser, "email" | "password" | "role">;

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as UserData;
  const username = genUsername();
  try {
    // Store new user in db
    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    // Generate access and refresh token for new user
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Store refresh token in db
    await Token.create({ token: refreshToken, userId: newUser._id });
    logger.info("Refresh token created for user", {
      userId: newUser._id,
      token: refreshToken,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      message: "New user created",
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });

    logger.info("User registered successfully", {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (err) {
    logger.error("Error during user registration", err);
    throw err;
  }
};

export default register;
