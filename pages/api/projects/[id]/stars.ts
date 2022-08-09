import { Prisma } from "@prisma/client";
import type { NextApiResponse } from "next";
import authenticate from "../../../../lib/api-utils/authenticate";
import prisma from "../../../../lib/prisma";
import withAuth from "../../../../middleware/with-auth";
import withProject from "../../../../middleware/with-project";
import { ExtendedNextApiRequest } from "../../../../types/next";

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return await handleGET(req, res);
    case "POST":
      return await withAuth(handlePOST)(req, res);
    case "DELETE":
      return await withAuth(handleDELETE)(req, res);
    default:
      return res.status(405).json({
        message: `The HTTP method ${req.method} is not supported for this route.`,
      });
  }
}

async function handleGET(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const user = await authenticate(req, res);

  const { id } = req.project!;

  const starCount = await prisma.star.count({
    where: {
      projectId: id,
    },
  });

  // If user is logged in, return wheter they have starred the project or not.
  if (!user) {
    return res.status(200).json({ starCount });
  } else {
    const hasStarred = !!(await prisma.star.findUnique({
      where: {
        userId_projectId: { userId: user.id, projectId: id },
      },
    }));

    return res.status(200).json({ starCount, hasStarred });
  }
}

async function handlePOST(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const { user, project } = req;

  try {
    const star = await prisma.star.create({
      data: {
        user: { connect: { id: user!.id } },
        project: { connect: { id: project!.id } },
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

async function handleDELETE(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const { user, project } = req;

  try {
    await prisma.star.delete({
      where: {
        userId_projectId: { userId: user!.id, projectId: project!.id },
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

export default withProject(handler);
