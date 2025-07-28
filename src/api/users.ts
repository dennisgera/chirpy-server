import type { NextFunction, Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";

export async function handlerCreateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await createUser(req.body);
    respondWithJSON(res, 201, user);
  } catch (err) {
    next(err);
  }
}
