import { Request, Response, NextFunction } from "express";
import config from "../config.js";

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
