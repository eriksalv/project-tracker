import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../../../../../lib/api-utils/authenticate";
import { projectWithBoardArgs } from "../../../../../lib/db-utils";
import prisma from "../../../../../lib/prisma";
import {
  CreateIssueForm,
  createIssueSchema,
} from "../../../../../lib/validation/issue";
import validate from "../../../../../lib/validation/validate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await handleGET(req, res);
    case "POST":
      return await handlePOST(req, res);
    default:
      return res.status(405).json({
        message: `The HTTP method ${req.method} is not supported for this route.`,
      });
  }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
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

  const { id: boardId } = board;

  const issues = await prisma.issue.findMany({
    where: {
      boardId,
    },
  });

  return res.status(200).json({
    issues,
  });
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticate(req, res);

  if (!user) {
    return res.status(401).json({
      message: "You must be logged in to create a project.",
    });
  }

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

  const { id: boardId } = board;

  const { body } = req;
  const { data, errors } = await validate(createIssueSchema, body);

  if (errors) {
    return res.status(422).json({ errors });
  }

  const { title, description, priority, status, assigneeId } =
    data as CreateIssueForm;

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
        status,
        assignee: assigneeId ? { connect: { id: assigneeId } } : undefined,
        board: {
          connect: {
            id: boardId,
          },
        },
      },
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
