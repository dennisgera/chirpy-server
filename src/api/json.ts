import { Response } from "express";

export function respondWithError(
  res: Response,
  status: number,
  error: string
): void {
  respondWithJSON(res, status, { error });
}

export function respondWithJSON(
  res: Response,
  status: number,
  json: any
): void {
  res.header("Content-Type", "application/json");
  const body = JSON.stringify(json);
  res.status(status).send(json);
  res.end();
}
