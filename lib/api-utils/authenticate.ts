import prisma from "../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { destroySession, verifyToken } from "./auth";
import { JwtPayload } from "jsonwebtoken";

export default async function authenticate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { cookies } = req;

  const jwt = cookies.token;

  if (!jwt) {
    return false;
  }

  const result = verifyToken(jwt) as JwtPayload | null;

  const id = result?.id;

  if (!id) {
    await destroySession(jwt, res);
    return false;
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      email: true,
      id: true,
      username: true,
      name: true,
    },
  });

  if (!user) {
    return false;
  }

  req.body = { ...req.body, user };

  return true;
}
