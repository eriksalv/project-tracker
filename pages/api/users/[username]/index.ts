import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { UserResponse } from "../../../../lib/queries/users";
import {
  UpdateProfileForm,
  updateProfileSchema,
} from "../../../../lib/validation/update-profile";
import validate from "../../../../lib/validation/validate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  switch (req.method) {
    case "GET":
      await handleGET(req, res);
      break;
    case "PUT":
      await handlePUT(req, res);
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

async function handlePUT(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  const { username } = req.query;

  const { body } = req;

  const { data, errors } = await validate(updateProfileSchema, body);

  if (errors) {
    return res.status(422).json({ errors });
  }

  const { name } = data as UpdateProfileForm;

  try {
    const updateUser = await prisma.user.update({
      where: {
        username: username as string,
      },
      data: {
        name,
      },
    });

    return res.status(200).json({
      message: "Successfully updated user",
      user: updateUser,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "User not found",
        });
      }
    }

    return res.status(500).json({
      message: "Something went wrong",
      errors: JSON.stringify(error),
    });
  }
}
