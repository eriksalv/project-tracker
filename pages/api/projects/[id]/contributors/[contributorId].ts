import type { NextApiResponse } from "next";
import { isContributor, userArgs } from "../../../../../lib/db-utils";
import prisma from "../../../../../lib/prisma";
import withAuth from "../../../../../middleware/with-auth";
import { ExtendedNextApiRequest } from "../../../../../types/next";
import withBoard from "../../../../../middleware/with-board";
import isInt from "../../../../../lib/api-utils/isInt";
import withProject from "../../../../../middleware/with-project";

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return await handleGET(req, res);
    case "POST":
      return await withProject(withAuth(handlePOST))(req, res);
    case "DELETE":
      return await withProject(withAuth(handleDELETE))(req, res);
    default:
      return res.status(405).json({
        message: `The HTTP method ${req.method} is not supported for this route.`,
      });
  }
}

async function handleGET(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const contributorId = req.query.contributorId;
  const board = req.board;

  if (!isInt(contributorId)) {
    return res.status(400).json({ message: "Invalid contributor id" });
  }

  if (contributorId && !(await isContributor(+contributorId, board?.id!))) {
    return res.status(404).json({
      message: "Contributor not found on this project.",
    });
  }

  const contributor = await prisma.contribution.findUnique({
    where: { userId_boardId: { userId: +contributorId!, boardId: board?.id! } },
    include: { user: userArgs },
  });

  return res.status(200).json({ contributor });
}

async function handlePOST(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const { user, board, project } = req;
  const { contributorId } = req.query;

  if (!isInt(contributorId)) {
    return res.status(400).json({ message: "Invalid contributor id" });
  }

  if (contributorId && (await isContributor(+contributorId, board?.id!))) {
    return res.status(200).json({
      message: "User is already a contributor on this project.",
    });
  }

  if (user?.id != project?.ownerId) {
    return res
      .status(401)
      .json({ message: "Only the project owner can add new contributors" });
  }

  const { id: boardId } = board!;

  try {
    const contributor = await prisma.contribution.create({
      data: {
        userId: +contributorId!,
        boardId,
      },
      include: {
        user: userArgs,
      },
    });

    return res.status(201).json({ contributor });
  } catch (error) {
    return res.status(500).json({ message: JSON.stringify(error) });
  }
}

async function handleDELETE(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const { user, project, board } = req;
  const contributorId = req.query.contributorId;

  if (!isInt(contributorId)) {
    return res.status(400).json({ message: "Invalid contributor id" });
  }

  if (contributorId && !(await isContributor(+contributorId, board?.id!))) {
    return res.status(200).json({
      message: "User is not a contributor, or already removed.",
    });
  }

  // Only project owner or contributor himself can revoke contributor status
  if (!(user?.id == project?.ownerId || user?.id == contributorId)) {
    return res.status(403).json({ message: "Permission denied." });
  }

  if (contributorId == project?.ownerId) {
    return res
      .status(403)
      .json({ message: "Cannot remove project owner as contributor" });
  }

  await prisma.contribution.delete({
    where: { userId_boardId: { userId: +contributorId!, boardId: board?.id! } },
  });

  return res.status(200).json({ message: "Successfully removed contributor" });
}

export default withBoard(handler);
