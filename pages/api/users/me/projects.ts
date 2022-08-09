import { NextApiResponse } from "next";
import { projectArgs } from "../../../../lib/db-utils";
import prisma from "../../../../lib/prisma";
import withAuth from "../../../../middleware/with-auth";
import { ExtendedNextApiRequest } from "../../../../types/next";

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
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
  const { user } = req;

  const projects = await prisma.project.findMany({
    where: {
      owner: {
        id: user!.id,
      },
    },
    ...projectArgs,
  });

  return res.status(200).json({ projects });
}

export default withAuth(handler);
