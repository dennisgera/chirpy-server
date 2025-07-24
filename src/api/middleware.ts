import type { Request, Response, NextFunction } from "express";
import config from "../config.js";
import { respondWithError } from "./json.js";

export const middlewareLogResponses = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.on("finish", () => {
    if (res.statusCode >= 300) {
      console.log(
        `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`
      );
    }
  });
  next();
};

export const middlewareMetricsInc = (
  _: Request,
  __: Response,
  next: NextFunction
): void => {
  config.fileserverHits++;
  next();
};

export const middlewareErrorHandler = (
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction
): void => {
  const statusCode = 500;
  const message = "Something went wrong on our end";
  console.error(err.message);
  respondWithError(res, statusCode, message);
};
