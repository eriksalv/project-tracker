import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../../../../lib/api-utils/authenticate";
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
  const user = await authenticate(req, res);

  if (!user) return res.status(401).json({ message: "You must be logged in" });

  const projects = await prisma.project.findMany({
    where: {
      owner: {
        id: user.id,
      },
    },
  });

  return res.status(200).json({ projects });
}
