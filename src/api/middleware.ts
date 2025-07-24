import type { Request, Response, NextFunction } from "express";
import config from "../config.js";
import { respondWithError } from "./json.js";
import {
  BadRequestError,
  UserNotAuthenticatedError,
  UserForbiddenError,
  NotFoundError,
} from "./errors.js";

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
  console.error(err.message);
  let statusCode = 500;
  let message = "Something went wrong on our end";
  if (err instanceof BadRequestError) {
    statusCode = 400;
    message = err.message;
  } else if (err instanceof UserNotAuthenticatedError) {
    statusCode = 401;
    message = err.message;
  } else if (err instanceof UserForbiddenError) {
    statusCode = 403;
    message = err.message;
  } else if (err instanceof NotFoundError) {
    statusCode = 404;
    message = err.message;
  }
  respondWithError(res, statusCode, message);
};
