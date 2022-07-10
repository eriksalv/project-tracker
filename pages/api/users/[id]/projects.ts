import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      await handleGET(req, res);
      break;
    default:
      return res.status(405).json({
        message: `The HTTP method ${req.method} is not supported for this route.`,
      });
  }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
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
  });

  return res.status(200).json({ projects });
}
