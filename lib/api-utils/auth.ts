import { User } from "@prisma/client";
import { hash, compare, genSalt } from "bcryptjs";
import jwt from "jsonwebtoken";
import redis from "../redis";
import setCookie from "./cookie";
import { NextApiResponse } from "next";

const jwtSecret = process.env.JWT_SECRET || "abc123";

export async function hashPassword(password: string) {
  const salt = await genSalt(10);
  return await hash(password, salt);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword);
}

export async function createSession(user: User, res: NextApiResponse) {
  const { id } = user;
  const token = signToken(id);
  await setToken(token, id);
  setCookie(res, "token", token);
  return { success: true, userId: id, token };
}

async function setToken(token: string, id: number) {
  return await redis.set(token, id);
}

function signToken(id: number) {
  return jwt.sign({ id }, jwtSecret);
}

export async function verifyAndDecodeToken(token: string) {
  return await redis.get(token);
}

export async function destroySession(token: string, res: NextApiResponse) {
  await redis.del(token);
  setCookie(res, "token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });
}
