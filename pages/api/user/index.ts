import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await handleGET(res);
  } else {
    throw new Error(
      `The HTTP method ${req.method} is not supported for this route.`
    );
  }
}

async function handleGET(res: NextApiResponse) {
  const users = await prisma.user.findMany({
    select: { email: true, id: true, username: true },
  });
  return res.status(200).json(users);
}
