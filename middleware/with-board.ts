import { NextApiResponse } from "next";
import { ExtendedNextApiRequest } from "../types/next";
import prisma from "../lib/prisma";

export default function withBoard(
  next: (req: ExtendedNextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async function handler(
    req: ExtendedNextApiRequest,
    res: NextApiResponse
  ) {
    const { id } = req.query;

    if (Number.isNaN(+id!)) {
      return res.status(400).json({ message: "Invalid project ID." });
    }

    const board = await prisma.board.findUnique({
      where: {
        projectId: +id!,
      },
    });

    if (!board) {
      return res.status(404).json({
        message: "Board not found.",
      });
    }

    req.board = board;

    return await next(req, res);
  };
}
