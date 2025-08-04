import { NextFunction, Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { UserNotAuthenticatedError } from "./errors.js";
import { checkPasswordHash } from "../auth.js";
import { respondWithJSON } from "./json.js";
import { UserResponse } from "./users.js";

export async function handlerLogin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  type parameters = {
    email: string;
    password: string;
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

    respondWithJSON(res, 200, {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } satisfies UserResponse);
  } catch (err) {
    next(err);
  }
}
