import type { NextApiResponse } from "next";
import { isContributor } from "../../../../../lib/db-utils";
import prisma from "../../../../../lib/prisma";
import {
  UpdateIssueForm,
  updateIssueSchema,
} from "../../../../../lib/validation/issue";
import withAuth from "../../../../../middleware/with-auth";
import withIssue from "../../../../../middleware/with-issue";
import withValidation from "../../../../../middleware/with-validation";
import { ExtendedNextApiRequest } from "../../../../../types/next";

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return await handleGET(req, res);
    case "PUT":
      return await withValidation(withAuth(handlePUT), updateIssueSchema)(
        req,
        res
      );
    case "DELETE":
      return await withAuth(handleDELETE)(req, res);
    default:
      return res.status(405).json({
        message: `The HTTP method ${req.method} is not supported for this route.`,
      });
  }
}

async function handleGET(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const { issue } = req;

  return res.status(200).json({ issue });
}

export async function handlePUT(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  const { issue, user, data } = req;

  if (!(await isContributor(user!.id, issue!.boardId))) {
    return res.status(403).json({
      message: "You are not a collaborator on this board.",
    });
  }

  const { title, description, priority, status, assigneeId } =
    data as UpdateIssueForm;

  if (assigneeId && !(await isContributor(assigneeId, issue!.boardId))) {
    return res.status(403).json({
      message:
        "Cannot change assignee to a user that is not a collaborator on this board.",
    });
  }

  try {
    const updatedIssue = await prisma.issue.update({
      where: {
        boardId_id: { id: issue!.id, boardId: issue!.boardId },
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

async function handleDELETE(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const { issue, user } = req;

  if (!(await isContributor(user!.id, issue!.boardId))) {
    return res.status(403).json({
      message: "You are not a collaborator on this board.",
    });
  }

  try {
    await prisma.issue.delete({
      where: {
        boardId_id: { id: issue!.id, boardId: issue!.boardId },
      },
    });

    return res.status(200).json({ message: "Issue deleted." });
  } catch (e) {
    return res.status(500).json({
      message: "Error deleting issue",
    });
  }
}

export default withIssue(handler);
