import { NextApiResponse } from "next";
import { ExtendedNextApiRequest } from "../types/next";
import prisma from "../lib/prisma";

export default function withIssue(
  next: (req: ExtendedNextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async function handler(
    req: ExtendedNextApiRequest,
    res: NextApiResponse
  ) {
    const { id: projectId, issueId } = req.query;

    if (Number.isNaN(+issueId!) || Number.isNaN(+projectId!)) {
      return res.status(400).json({
        message: "The issueId and projectId parameters must be numbers.",
      });
    }

    const board = await prisma.board.findUnique({
      where: {
        projectId: +projectId!,
      },
    });

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    const issue = await prisma.issue.findUnique({
      where: {
        boardId_id: { id: +issueId!, boardId: board.id },
      },
    });

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found.",
      });
    }

    req.issue = issue;

    return await next(req, res);
  };
}
