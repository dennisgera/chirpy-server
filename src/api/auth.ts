import { NextFunction, Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { revokeRefreshToken } from "../db/queries/refreshToken.js";
import { UserNotAuthenticatedError } from "./errors.js";
import {
  checkPasswordHash,
  getBearerToken,
  makeJWT,
  makeRefreshToken,
} from "../auth.js";
import { respondWithJSON } from "./json.js";
import { UserResponse } from "./users.js";
import config from "../config.js";
import {
  getUserForRefreshToken,
  saveRefreshToken,
} from "../db/queries/refreshToken.js";

type LoginResponse = UserResponse & {
  token: string;
  refreshToken: string;
};

export async function handlerLogin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  type parameters = {
    email: string;
    password: string;
  };

  const params: parameters = req.body;
  try {
    const user = await getUserByEmail(params.email);
    if (!user) {
      throw new UserNotAuthenticatedError("Invalid email or password");
    }

    const isPasswordValid = await checkPasswordHash(
      params.password,
      user.hashedPassword
    );
    if (!isPasswordValid) {
      throw new UserNotAuthenticatedError("Invalid email or password");
    }

    const accessToken = makeJWT(
      user.id,
      config.jwt.defaultDuration,
      config.jwt.secret
    );
    const refreshToken = makeRefreshToken();
    const saved = await saveRefreshToken(user.id, refreshToken);
    if (!saved) {
      throw new UserNotAuthenticatedError("could not save refresh token");
    }

    respondWithJSON(res, 200, {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token: accessToken,
      refreshToken: refreshToken,
      isChirpyRed: user.isChirpyRed,
    } satisfies LoginResponse);
  } catch (err) {
    next(err);
  }
}

export async function handlerRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let refreshToken = getBearerToken(req);
  const user = await getUserForRefreshToken(refreshToken);
  if (!user) {
    res.status(401).send();
    return;
  }

  const accessToken = makeJWT(
    user.id,
    config.jwt.defaultDuration,
    config.jwt.secret
  );

  respondWithJSON(res, 200, {
    token: accessToken,
  });
}

export async function handlerRevokeToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const refreshToken = getBearerToken(req);
  await revokeRefreshToken(refreshToken);
  res.status(204).send();
}
