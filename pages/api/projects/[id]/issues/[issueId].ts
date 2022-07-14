import type { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../../../../../lib/api-utils/authenticate";
import prisma from "../../../../../lib/prisma";
import {
  UpdateIssueForm,
  updateIssueSchema,
} from "../../../../../lib/validation/issue";
import validate from "../../../../../lib/validation/validate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await handleGET(req, res);
    case "PUT":
      return await handlePUT(req, res);
    case "DELETE":
      return await handleDELETE(req, res);
    default:
      return res.status(405).json({
        message: `The HTTP method ${req.method} is not supported for this route.`,
      });
  }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
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

  return res.status(200).json({ issue });
}

export async function handlePUT(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticate(req, res);

  if (!user) {
    return res.status(401).json({
      message: "You must be logged in to update an issue.",
    });
  }

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

  const isContributor = await prisma.contribution.findUnique({
    where: {
      userId_boardId: { userId: user.id, boardId: issue.boardId },
    },
  });

  if (!isContributor) {
    return res.status(403).json({
      message: "You are not a collaborator on this board.",
    });
  }

  const { body } = req;

  const { data, errors } = await validate(updateIssueSchema, body);

  if (errors) {
    return res.status(422).json({ errors });
  }

  const { title, description, priority, status, assigneeId } =
    data as UpdateIssueForm;

  if (assigneeId) {
    const isContributor = await prisma.contribution.findUnique({
      where: {
        userId_boardId: { userId: assigneeId, boardId: issue.boardId },
      },
    });

    if (!isContributor) {
      return res.status(403).json({
        message:
          "Cannot change assignee to a user that is not a collaborator on this board.",
      });
    }
  }

  try {
    const updatedIssue = await prisma.issue.update({
      where: {
        boardId_id: { id: +issueId!, boardId: board.id },
      },
      data: {
        title,
        description,
        priority,
        status,
        assigneeId,
      },
    });

    return res.status(200).json({ issue: updatedIssue });
  } catch (e) {
    return res.status(500).json({
      message: "Error updating project",
    });
  }
}

async function handleDELETE(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticate(req, res);

  if (!user) {
    return res.status(401).json({
      message: "You must be logged in to delete an issue.",
    });
  }

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

  const isContributor = await prisma.contribution.findUnique({
    where: {
      userId_boardId: { userId: user.id, boardId: issue.boardId },
    },
  });

  if (!isContributor) {
    return res.status(403).json({
      message: "You are not a collaborator on this board.",
    });
  }

  try {
    await prisma.issue.delete({
      where: {
        boardId_id: { id: +issueId!, boardId: board.id },
      },
    });

    return res.status(200).json({ message: "Issue deleted." });
  } catch (e) {
    return res.status(500).json({
      message: "Error deleting issue",
    });
  }
}
