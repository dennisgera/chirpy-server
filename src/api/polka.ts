import { NextFunction, Request, Response } from "express";
import { updateUserIsChirpyRed } from "../db/queries/users.js";
import { getAPIKey } from "../auth.js";
import config from "../config.js";

export async function handlerPolkaWebhooks(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const apiKey = getAPIKey(req);
    if (apiKey !== config.api.polkaApiKey) {
      res.status(401).send();
      return;
    }
    type Body = {
      event: string;
      data: {
        userId: string;
      };
    };
    const body: Body = req.body;
    const userId = body.data.userId;
    const isUserUpgraded = body.event === "user.upgraded";
    if (!isUserUpgraded) {
      res.status(204).send();
      return;
    }
    const user = await updateUserIsChirpyRed(userId, true);
    if (!user) {
      res.status(404).send();
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
