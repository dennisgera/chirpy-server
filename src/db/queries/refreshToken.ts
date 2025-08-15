import { User } from "../schema.js";
import { db } from "../index.js";
import { refreshTokens, users } from "../schema.js";
import config from "../../config.js";
import { and, eq, gt, isNull } from "drizzle-orm";

export async function saveRefreshToken(
  userId: string,
  refreshToken: string
): Promise<boolean> {
  const rows = await db
    .insert(refreshTokens)
    .values({
      userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + config.jwt.refreshDuration),
      revokedAt: null,
    })
    .returning();
  return rows.length > 0;
}

export async function revokeRefreshToken(token: string): Promise<void> {
  const rows = await db
    .update(refreshTokens)
    .set({ revokedAt: new Date(), updatedAt: new Date() })
    .where(eq(refreshTokens.token, token))
    .returning();

  if (rows.length === 0) {
    throw new Error("Couldn't revoke refresh token, token not found");
  }
}

export async function getUserForRefreshToken(token: string): Promise<User> {
  const [result] = await db
    .select({ user: users })
    .from(users)
    .innerJoin(refreshTokens, eq(refreshTokens.userId, users.id))
    .where(
      and(
        eq(refreshTokens.token, token),
        isNull(refreshTokens.revokedAt),
        gt(refreshTokens.expiresAt, new Date())
      )
    )
    .limit(1);

  return result?.user;
}
