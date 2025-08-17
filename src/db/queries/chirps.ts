import { db } from "../index.js";
import { Chirp, NewChirp, chirps } from "../schema.js";
import { asc, desc, eq } from "drizzle-orm";

export async function createChirp(chirp: NewChirp): Promise<Chirp> {
  const [result] = await db.insert(chirps).values(chirp).returning();
  return result;
}

export async function getChirps(
  authorId?: string,
  sort?: "asc" | "desc"
): Promise<Chirp[]> {
  const orderBy =
    sort === "asc" ? asc(chirps.createdAt) : desc(chirps.createdAt);
  if (authorId) {
    const result = await db
      .select()
      .from(chirps)
      .where(eq(chirps.userId, authorId))
      .orderBy(orderBy);
    return result;
  } else {
    const result = await db.select().from(chirps).orderBy(orderBy);
    return result;
  }
}

export async function getChirpById(id: string): Promise<Chirp | null> {
  const result = await db.select().from(chirps).where(eq(chirps.id, id));
  return result[0] ?? null;
}

export async function deleteChirp(id: string): Promise<Chirp | null> {
  const [result] = await db.delete(chirps).where(eq(chirps.id, id)).returning();
  return result;
}
