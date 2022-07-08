import prisma from "../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../auth";
import { JwtPayload } from "jsonwebtoken";

export default async function authenticate(req: NextApiRequest) {
  const { cookies } = req;

  const jwt = cookies.token;

  if (!jwt) {
    return false;
  }

  const result = (await verifyToken(jwt)) as JwtPayload | null;

  const id = result?.id;

  if (!id) {
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
