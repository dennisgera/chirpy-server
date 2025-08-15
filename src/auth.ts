import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import { UserNotAuthenticatedError } from "./api/errors.js";
import { Request } from "express";

const TOKEN_ISSUER = "chirpy";
type Payload = Pick<JwtPayload, "sub" | "exp" | "iss" | "iat">;

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function checkPasswordHash(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const result = await bcrypt.compare(password, hashedPassword);
  return result;
}

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string
): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + expiresIn;
  const token = jwt.sign(
    {
      iss: TOKEN_ISSUER,
      sub: userID,
      iat: issuedAt,
      exp: expiresAt,
    } satisfies Payload,
    secret,
    { algorithm: "HS256" }
  );

  return token;
}

export function validateJWT(
  tokenString: string,
  secret: string
): string | undefined {
  let decoded: Payload;
  try {
    decoded = jwt.verify(tokenString, secret, {
      algorithms: ["HS256"],
    }) as JwtPayload;
  } catch (err) {
    throw new UserNotAuthenticatedError("Invalid token");
  }

  if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
    throw new UserNotAuthenticatedError("Token expired");
  }

  if (decoded.iss !== TOKEN_ISSUER) {
    throw new UserNotAuthenticatedError("Invalid token");
  }

  if (!decoded.sub) {
    throw new UserNotAuthenticatedError("Invalid token");
  }

  return decoded.sub;
}

export function getBearerToken(req: Request): string {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new UserNotAuthenticatedError("Missing Authorization header");
  }

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer") {
    throw new UserNotAuthenticatedError("Invalid Authorization header");
  }

  return token;
}

export function makeRefreshToken() {
  return crypto.randomBytes(32).toString("hex");
}
