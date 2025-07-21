import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";

export async function handlerChirpsValidate(
  req: Request,
  res: Response
): Promise<void> {
  type Parameters = {
    body: string;
  };

  const params: Parameters = req.body;

  const maxLength = 140;
  if (params.body.length > maxLength) {
    respondWithError(res, 400, "Chirp is too long");
    return;
  }

  respondWithJSON(res, 200, { valid: true });
}
