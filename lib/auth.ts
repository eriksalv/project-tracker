import { User } from "@prisma/client";
import { hash, compare, genSalt } from "bcryptjs";
import jwt from "jsonwebtoken";
import redis from "./redis";

export async function hashPassword(password: string) {
  const salt = await genSalt(10);
  return await hash(password, salt);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword);
}

export async function createSession(user: User) {
  const { id } = user;
  const token = signToken(id);
  try {
    await setToken(token, id);
    return { success: true, userId: id, token };
  } catch (error) {
    console.log(error);
  }
}

async function setToken(token: string, id: number) {
  return await redis.set(token, id);
}

function signToken(id: number) {
  const jwtSecret = process.env.JWT_SECRET || "abc123";
  return jwt.sign({ id }, jwtSecret, { expiresIn: "2 days" });
}

export async function getAuthTokenId(token: string) {
  return await redis.get(token);
}
