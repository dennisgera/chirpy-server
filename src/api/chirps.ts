import type { NextFunction, Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";
import {
  createChirp,
  deleteChirp,
  getChirpById,
  getChirps,
} from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import config from "../config.js";

function validateChirp(body: string) {
  const maxChirpLength = 140;
  if (body.length > maxChirpLength) {
    throw new BadRequestError(
      `Chirp is too long. Max length is ${maxChirpLength}`
    );
  }

  const badWords = ["kerfuffle", "sharbert", "fornax"];
  return getCleanedBody(body, badWords);
}

function getCleanedBody(body: string, badWords: string[]) {
  const words = body.split(" ");

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const loweredWord = word.toLowerCase();
    if (badWords.includes(loweredWord)) {
      words[i] = "****";
    }
  }

  const cleaned = words.join(" ");
  return cleaned;
}

export async function handlerCreateChirp(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  type Parameters = {
    body: string;
  };
  try {
    const params: Parameters = req.body;
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwt.secret);
    const cleaned = validateChirp(params.body);
    const chirp = await createChirp({
      body: cleaned,
      userId: userId,
    });
    respondWithJSON(res, 201, chirp);
  } catch (err) {
    next(err);
  }
}

export async function handlerGetChirps(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    type Parameters = {
      authorId?: string;
      sort?: "asc" | "desc";
    };
    const params: Parameters = req.query;
    const chirps = await getChirps(params.authorId, params.sort);
    respondWithJSON(res, 200, chirps);
  } catch (err) {
    next(err);
  }
}

export async function handlerGetChirpById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const chirp = await getChirpById(req.params.id);
    if (!chirp) {
      res.status(404).send();
      return;
    }
    respondWithJSON(res, 200, chirp);
  } catch (err) {
    next(err);
  }
}

export async function handlerDeleteChirp(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwt.secret);
    if (!userId) {
      res.status(401).send();
      return;
    }
    const chirp = await getChirpById(req.params.id);
    if (!chirp) {
      res.status(404).send();
      return;
    }
    if (userId !== chirp.userId) {
      res.status(403).send();
      return;
    }

    await deleteChirp(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
