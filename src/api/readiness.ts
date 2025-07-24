import type { NextFunction, Request, Response } from "express";

export async function handlerReadiness(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.set("Content-Type", "text/plain");
    res.send("OK");
    res.end();
  } catch (err) {
    next(err);
  }
}
