import bcrypt from "bcrypt";

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
