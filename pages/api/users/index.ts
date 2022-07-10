import type { NextApiRequest, NextApiResponse } from "next";
import { userArgs } from "../../../lib/db-utils";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await handleGET(res);
    default:
      return res.status(405).json({
        message: `The HTTP method ${req.method} is not supported for this route.`,
      });
  }
}

async function handleGET(res: NextApiResponse) {
  const users = await prisma.user.findMany(userArgs);
  return res.status(200).json(users);
}
