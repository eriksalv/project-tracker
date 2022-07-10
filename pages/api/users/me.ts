import { Prisma } from "@prisma/client";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import authenticate from "../../../lib/api-utils/authenticate";
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
  const user = await authenticate(req, res);

  if (!user) return res.status(401).json({ message: "You must be logged in" });

  return res.status(200).json({ user });
}

async function handlePUT(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  const user = await authenticate(req, res);

  if (!user) return res.status(401).json({ message: "You must be logged in" });

  const { id } = user;

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
