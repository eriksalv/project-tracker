import prisma from "../prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { destroySession, verifyAndDecodeToken } from "./auth";

export default async function authenticate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { cookies } = req;

  const jwt = cookies.token;

  if (!jwt) {
    return null;
  }

  const id = await verifyAndDecodeToken(jwt);

  if (!id) {
    await destroySession(jwt, res);
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: +id },
    select: {
      email: true,
      id: true,
      username: true,
      name: true,
    },
  });

  if (!user) {
    return null;
  }

  return user;
}
