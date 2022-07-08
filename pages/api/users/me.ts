import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import authenticate from "../../../lib/middleware/authenticate";
import prisma from "../../../lib/prisma";
import { UserResponse } from "../../../lib/queries/users";
import {
  UpdateProfileForm,
  updateProfileSchema,
} from "../../../lib/validation/update-profile";
import validate from "../../../lib/validation/validate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  const authorized = await authenticate(req);

  if (!authorized) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const { user } = req.body;

  return res.status(200).json({ user });
}

async function handlePUT(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  const authorized = await authenticate(req);

  if (!authorized) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.body.user;

  const { body } = req;

  const { data, errors } = await validate(updateProfileSchema, body);

  if (errors) {
    return res.status(422).json({ errors });
  }

  const { name } = data as UpdateProfileForm;

  try {
    const updateUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
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
