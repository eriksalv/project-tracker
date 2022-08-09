import { Prisma } from "@prisma/client";
import { NextApiResponse } from "next";
import withAuth from "../../../../middleware/with-auth";
import { userArgs } from "../../../../lib/db-utils";
import prisma from "../../../../lib/prisma";
import { UserResponse } from "../../../../lib/queries/users";
import {
  UpdateProfileForm,
  updateProfileSchema,
} from "../../../../lib/validation/update-profile";
import withValidation from "../../../../middleware/with-validation";
import { ExtendedNextApiRequest } from "../../../../types/next";

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return await handleGET(req, res);
    case "PUT":
      return await withValidation(handlePUT, updateProfileSchema)(req, res);
    default:
      return res.status(405).json({
        message: `The HTTP method ${req.method} is not supported for this route.`,
      });
  }
}

async function handleGET(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const { user } = req;

  return res.status(200).json({ user });
}

async function handlePUT(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  const { user, data } = req;

  const { id } = user!;

  const { name } = data as UpdateProfileForm;

  try {
    const updateUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
      },
      ...userArgs,
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

export default withAuth(handler);
