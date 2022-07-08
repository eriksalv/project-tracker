import { User } from "@prisma/client";
import { hash, compare, genSalt } from "bcryptjs";
import jwt from "jsonwebtoken";
import redis from "./redis";
import { verify } from "jsonwebtoken";
import { NextApiResponse } from "next";

const jwtSecret = process.env.JWT_SECRET || "abc123";

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
  await setToken(token, id);
  return { success: true, userId: id, token };
}

async function setToken(token: string, id: number) {
  return await redis.set(token, id);
}

function signToken(id: number) {
  return jwt.sign({ id }, jwtSecret, { expiresIn: "30m" });
}

export async function getAuthTokenId(token: string) {
  if (await verifyToken(token)) {
    return await redis.get(token);
  }
  return null;
}

export async function verifyToken(token: string) {
  let userId;
  try {
    userId = verify(token, jwtSecret);
  } catch (error) {
    return null;
  }
  if (await redis.get(token)) {
    return userId;
  }
  await redis.del(token);
  return null;
}
