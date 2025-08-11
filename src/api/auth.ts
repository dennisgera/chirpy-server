import { NextFunction, Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { UserNotAuthenticatedError } from "./errors.js";
import { checkPasswordHash, makeJWT } from "../auth.js";
import { respondWithJSON } from "./json.js";
import { UserResponse } from "./users.js";
import config from "../config.js";

export async function handlerLogin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  type parameters = {
    email: string;
    password: string;
    expiresInSeconds?: number;
  };

  const params: parameters = req.body;
  try {
    const user = await getUserByEmail(params.email);
    if (!user) {
      throw new UserNotAuthenticatedError("Invalid email or password");
    }

    const isPasswordValid = await checkPasswordHash(
      params.password,
      user.hashedPassword
    );
    if (!isPasswordValid) {
      throw new UserNotAuthenticatedError("Invalid email or password");
    }

    const token = makeJWT(
      user.id,
      params.expiresInSeconds?.toString() ?? "3600",
      config.jwt.secret
    );

    respondWithJSON(res, 200, {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token,
    } satisfies UserResponse & { token: string });
  } catch (err) {
    next(err);
  }
}
