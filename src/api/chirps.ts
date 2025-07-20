import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";

export async function handlerChirpsValidate(
  req: Request,
  res: Response
): Promise<void> {
  type Parameters = {
    body: string;
  };

  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  let params: Parameters;
  req.on("end", () => {
    try {
      params = JSON.parse(body);
    } catch (error) {
      respondWithError(res, 400, "Something went wrong");
      return;
    }
    const maxLength = 140;
    if (params.body.length > maxLength) {
      respondWithError(res, 400, "Chirp is too long");
    } else {
      respondWithJSON(res, 200, { valid: true });
    }
  });
}
