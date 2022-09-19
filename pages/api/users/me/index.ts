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
import { verifyPassword, hashPassword } from "../../../../lib/api-utils/auth";

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
  const { user: u, data } = req;

  const { id } = u!;

  const { name, username, email, password, newPassword } =
    data as UpdateProfileForm;

  const user = await prisma.user.findUnique({
    where: {
      id: u?.id,
    },
  });

  if (!(await verifyPassword(password!, user?.password!))) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  if (
    username &&
    username != user?.username &&
    (await prisma.user.findUnique({ where: { username } }))
  ) {
    return res.status(409).json({ message: "Username already taken" });
  }

  if (
    email &&
    email != user?.email &&
    (await prisma.user.findUnique({ where: { email } }))
  ) {
    return res.status(409).json({ message: "Email already taken" });
  }

  try {
    const hashedNewPassword = newPassword && (await hashPassword(newPassword));

    const updateUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        username,
        email,
        password: hashedNewPassword,
      },
      ...userArgs,
    });

    return res.status(200).json({
      message: "User updated successfully",
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
