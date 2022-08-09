import { NextApiResponse } from "next";
import { projectWithBoardArgs } from "../lib/db-utils";
import prisma from "../lib/prisma";
import { ExtendedNextApiRequest } from "../types/next";

export default function withProject(
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

    const project = await prisma.project.findUnique({
      where: {
        id: +id!,
      },
      ...projectWithBoardArgs,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    req.project = project;

    return await next(req, res);
  };
}
