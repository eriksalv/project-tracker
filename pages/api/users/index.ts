import type { NextApiResponse } from "next";
import { userArgs } from "../../../lib/db-utils";
import prisma from "../../../lib/prisma";
import { ExtendedNextApiRequest } from "../../../types/next";

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await handleGET(req, res);
    default:
      return res.status(405).json({
        message: `The HTTP method ${req.method} is not supported for this route.`,
      });
  }
}

async function handleGET(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

  const search = typeof req.query.search === "string" ? req.query.search : "";

  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          username: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
    take: limit,
    ...userArgs,
  });
  return res.status(200).json({ users });
}
