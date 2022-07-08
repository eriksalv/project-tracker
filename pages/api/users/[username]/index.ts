import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { UserResponse } from "../../../../lib/queries/users";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  switch (req.method) {
    case "GET":
      await handleGET(req, res);
      break;
    default:
      return res.status(405).json({
        message: `The HTTP method ${req.method} is not supported for this route.`,
      });
  }
}

async function handleGET(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  const { username } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username as string,
      },
      select: {
        email: true,
        username: true,
        name: true,
        id: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(200).json({
      message: "Something went wrong",
    });
  }
}
