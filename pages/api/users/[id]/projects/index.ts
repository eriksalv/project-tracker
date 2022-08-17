import { NextApiResponse } from "next";
import isInt from "../../../../../lib/api-utils/isInt";
import { projectArgs } from "../../../../../lib/db-utils";
import prisma from "../../../../../lib/prisma";
import { ExtendedNextApiRequest } from "../../../../../types/next";

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
  const { id, limit } = req.query;

  if (!isInt(id)) {
    return res.status(400).json({
      message: "Invalid user id",
    });
  }

  if (limit && !isInt(limit)) {
    console.log("hello");

    return res.status(400).json({
      message: "Invalid limit",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: +id!,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const projects = await prisma.project.findMany({
    take: limit ? +limit : undefined,
    where: {
      owner: {
        id: +id!,
      },
    },
    ...projectArgs,
  });

  return res.status(200).json({ projects });
}
