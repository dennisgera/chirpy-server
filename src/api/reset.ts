import type { NextFunction, Request, Response } from "express";
import config from "../config.js";
import { db } from "../db/index.js";
import { sql } from "drizzle-orm";

const reset = async () => {
  config.api.fileServerHits = 0;
  if (process.env.PLATFORM === "dev") {
    await db.execute(sql`DELETE FROM users`);
  }
};

export async function handlerReset(
  _: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await reset();
    res.send("OK");
    res.end();
  } catch (err) {
    next(err);
  }
}
