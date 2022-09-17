import type { NextApiResponse } from "next";
import { userArgs } from "../../../../../lib/db-utils";
import prisma from "../../../../../lib/prisma";
import { ExtendedNextApiRequest } from "../../../../../types/next";
import withBoard from "../../../../../middleware/with-board";

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
  const board = req.board;

  const contributors = await prisma.contribution.findMany({
    where: { boardId: board?.id },
    include: { user: userArgs },
  });

  return res.status(200).json({ contributors });
}

export default withBoard(handler);
