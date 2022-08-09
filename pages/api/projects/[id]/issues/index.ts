import { Prisma } from "@prisma/client";
import type { NextApiResponse } from "next";
import { isContributor, issueArgs } from "../../../../../lib/db-utils";
import prisma from "../../../../../lib/prisma";
import {
  CreateIssueForm,
  createIssueSchema,
} from "../../../../../lib/validation/issue";
import withAuth from "../../../../../middleware/with-auth";
import { ExtendedNextApiRequest } from "../../../../../types/next";
import withBoard from "../../../../../middleware/with-board";
import withValidation from "../../../../../middleware/with-validation";

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return await handleGET(req, res);
    case "POST":
      return await withValidation(withAuth(handlePOST), createIssueSchema)(
        req,
        res
      );
    default:
      return res.status(405).json({
        message: `The HTTP method ${req.method} is not supported for this route.`,
      });
  }
}

async function handleGET(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;

  const board = req.board!;

  const { id: boardId } = board;

  // Get issues with pagination
  const issuesAndCount = await prisma.$transaction([
    prisma.issue.findMany({
      where: {
        boardId,
      },
      skip: (page - 1) * 10,
      take: 10,
      ...issueArgs,
      orderBy: [
        {
          id: "desc",
        },
      ],
    }),
    prisma.issue.count({ where: { boardId } }),
  ]);

  return res.status(200).json({
    issues: issuesAndCount[0],
    count: issuesAndCount[1],
  });
}

async function handlePOST(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const { user, board, data } = req;

  if (!(await isContributor(user!.id, board!.id))) {
    return res.status(403).json({
      message: "You are not a collaborator on this board.",
    });
  }

  const { id: boardId } = board!;

  const { title, description, priority, assigneeId } = data as CreateIssueForm;

  try {
    const issue = await prisma.issue.create({
      data: {
        id:
          (await prisma.issue.count({
            where: {
              boardId,
            },
          })) + 1,
        title,
        description,
        priority,
        status: "OPEN",
        assignee: assigneeId ? { connect: { id: assigneeId } } : undefined,
        creator: { connect: { id: user!.id } },
        board: {
          connect: {
            id: boardId,
          },
        },
      },
      ...issueArgs,
    });

    return res.status(201).json({ issue });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "User not found.",
        });
      }
    }

    return res.status(500).json({ message: JSON.stringify(error) });
  }
}

export default withBoard(handler);
