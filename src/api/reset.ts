import type { NextFunction, Request, Response } from "express";
import config from "../config.js";

export async function handlerReset(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    config.api.fileServerHits = 0;
    res.send("OK");
    res.end();
  } catch (err) {
    next(err);
  }
}
