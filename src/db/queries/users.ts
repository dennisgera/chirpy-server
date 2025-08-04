import { db } from "../index.js";
import { NewUser, User, users } from "../schema.js";
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
