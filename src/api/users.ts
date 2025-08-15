import type { NextFunction, Request, Response } from "express";
import { createUser, updateUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { NewUser, User, UserUpdate } from "../db/schema.js";
import { BadRequestError } from "./errors.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth.js";
import config from "../config.js";

export type UserResponse = Omit<User, "hashedPassword">;

export async function handlerCreateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  type parameters = {
    email: string;
    password: string;
  };

  const params: parameters = req.body;
  if (!params.email || !params.password) {
    throw new BadRequestError("Missing required fields");
  }

  const hashedPassword = await hashPassword(params.password);

  try {
    const user = await createUser({
      email: params.email,
      hashedPassword,
    } satisfies NewUser);
    if (!user) {
      throw new Error("Could not create user");
    }
    respondWithJSON(res, 201, {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } satisfies UserResponse);
  } catch (err) {
    next(err);
  }
}

export async function handlerUpdateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  type parameters = {
    email: string;
    password: string;
  };

  const params: parameters = req.body;
  if (!params.email || !params.password) {
    throw new BadRequestError("Missing required fields");
  }
  const token = getBearerToken(req);
  const userId = validateJWT(token, config.jwt.secret);
  if (!userId) {
    res.status(401).send();
    return;
  }

  const hashedPassword = await hashPassword(params.password);

  try {
    const user = await updateUser(userId, {
      email: params.email,
      hashedPassword,
    } satisfies UserUpdate);
    if (!user) {
      throw new Error("Could not update user");
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
