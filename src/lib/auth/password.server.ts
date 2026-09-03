import bcrypt from "bcryptjs";

const ROUNDS = 10;

export async function hashPasswordServer(password: string): Promise<string> {
  return bcrypt.hash(password, ROUNDS);
}

export async function verifyPasswordServer(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
