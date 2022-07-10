import type { NextApiRequest, NextApiResponse } from "next";
import { userArgs } from "../../../../lib/db-utils";
import prisma from "../../../../lib/prisma";
import { UserResponse } from "../../../../lib/queries/users";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  switch (req.method) {
    case "GET":
      return await handleGET(req, res);
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
  const { id } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: +id!,
      },
      ...userArgs,
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
