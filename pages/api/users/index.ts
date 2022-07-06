import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      await handleGET(res);
      break;
    default:
      return res.status(405).json({
        user: null,
        errors: null,
        message: `The HTTP method ${req.method} is not supported for this route.`,
      });
  }
}

async function handleGET(res: NextApiResponse) {
  const users = await prisma.user.findMany({
    select: { email: true, id: true, username: true },
  });
  return res.status(200).json(users);
}
