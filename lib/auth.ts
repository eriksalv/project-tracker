import { hash, compare, genSalt } from "bcryptjs";

export async function hashPassword(password: string) {
  const salt = await genSalt(10);
  return await hash(password, salt);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword);
}
