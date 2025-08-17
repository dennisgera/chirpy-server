import { db } from "../index.js";
import { NewUser, User, users, UserUpdate } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser): Promise<User> {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result;
}

export async function updateUser(
  userId: string,
  update: UserUpdate
): Promise<User | null> {
  const { email, hashedPassword } = update;
  const [result] = await db
    .update(users)
    .set({ email, hashedPassword, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  return result;
}

export async function updateUserIsChirpyRed(
  userId: string,
  isChirpyRed: boolean
): Promise<User | null> {
  const [result] = await db
    .update(users)
    .set({ isChirpyRed, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  return result;
}
