import type { NextFunction, Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { NewUser, User } from "../db/schema.js";
import { BadRequestError } from "./errors.js";
import { hashPassword } from "../auth.js";

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
