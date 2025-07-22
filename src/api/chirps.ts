import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";

const profaneWords = ["kerfuffle", "sharbert", "fornax"];

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

  if (profaneWords.some((word) => params.body.toLowerCase().includes(word))) {
    // Replace each profane word with ****
    let cleanedBody = params.body;
    for (const word of profaneWords) {
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      // Match word boundary at start, but not followed by punctuation at end
      const regex = new RegExp(`\\b${escapedWord}(?![!.,;:?])`, "gi");
      cleanedBody = cleanedBody.replace(regex, "****");
    }
    respondWithJSON(res, 200, { cleanedBody });
    return;
  }

  respondWithJSON(res, 200, { cleanedBody: params.body });
  return;
}
