import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../../../../lib/api-utils/authenticate";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await handleGET(req, res);
    case "POST":
      return await handlePOST(req, res);
    case "DELETE":
      return await handleDELETE(req, res);
    default:
      return res.status(405).json({
        message: `The HTTP method ${req.method} is not supported for this route.`,
      });
  }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticate(req, res);
  const { id } = req.query;

  if (!user) {
    const starCount = await prisma.star.count({
      where: {
        projectId: +id!,
      },
    });

    return res.status(200).json({ starCount });
  } else {
    const starCount = await prisma.star.count({
      where: {
        projectId: +id!,
      },
    });

    const userStar = await prisma.star.findUnique({
      where: {
        userId_projectId: { userId: user.id, projectId: +id! },
      },
    });

    return res.status(200).json({ starCount, userStar });
  }
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticate(req, res);

  if (!user) {
    return res.status(401).json({ message: "You must be logged in to star." });
  }

  const { id } = req.query;

  const project = await prisma.project.findUnique({
    where: { id: +id! },
  });

  if (!project) {
    return res.status(404).json({ message: "Project not found." });
  }

  try {
    const star = await prisma.star.create({
      data: {
        user: { connect: { id: user.id } },
        project: { connect: { id: project.id } },
      },
    });
    return res
      .status(201)
      .json({ userStar: star, message: "Starred project successfully" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002")
        return res
          .status(422)
          .json({ message: "You have already starred this project." });
    }
    return res.status(500).json({ message: "An error occurred." });
  }
}

async function handleDELETE(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticate(req, res);

  if (!user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to unstar." });
  }

  const { id } = req.query;

  const project = await prisma.project.findUnique({
    where: { id: +id! },
  });

  if (!project) {
    return res.status(404).json({ message: "Project not found." });
  }

  try {
    await prisma.star.delete({
      where: {
        userId_projectId: { userId: user.id, projectId: +id! },
      },
    });
    return res.status(200).json({ message: "Unstarred successfully" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025")
        return res
          .status(422)
          .json({ message: "You have already unstarred this project." });
    }
    return res.status(500).json({ message: "An error occurred." });
  }
}
