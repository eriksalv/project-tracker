import { NextApiResponse } from "next";
import { projectArgs } from "../../../../lib/db-utils";
import prisma from "../../../../lib/prisma";
import { ExtendedNextApiRequest } from "../../../../types/next";

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
  const { id } = req.query;

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
    where: {
      owner: {
        id: +id!,
      },
    },
    ...projectArgs,
  });

  return res.status(200).json({ projects });
}
