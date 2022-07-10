import { NextApiRequest, NextApiResponse } from "next";
import {
  createSession,
  destroySession,
  verifyAndDecodeToken,
  verifyPassword,
} from "../../../lib/api-utils/auth";
import prisma from "../../../lib/prisma";
import { LoginForm, loginSchema } from "../../../lib/validation/signin";
import validate from "../../../lib/validation/validate";
import { AuthResponse } from "../../../lib/queries/auth";
import { userArgs } from "../../../lib/db-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  switch (req.method) {
    case "POST":
      return await handlePOST(req, res);
    default:
      return res.status(405).json({
        message: `The HTTP method ${req.method} is not supported for this route.`,
      });
  }
}

async function handlePOST(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  const { cookies } = req;

  const jwt = cookies.token;

  const userId = jwt && (await verifyAndDecodeToken(jwt));

  if (userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: +userId,
      },
      ...userArgs,
    });

    if (!user) {
      return res.status(404).json({ message: "Something went wrong" });
    }

    return res.status(200).json({
      message: "Already signed in",
      user,
    });
  }

  if (jwt && !userId) {
    await destroySession(jwt, res);
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { body } = req;

  const { data, errors } = await validate(loginSchema, body);

  if (errors) {
    return res.status(422).json({ errors });
  }

  const { emailOrUsername, password } = data as LoginForm;

  let user = await prisma.user.findUnique({
    where: { email: emailOrUsername },
  });

  if (!user) {
    user = await prisma.user.findUnique({
      where: { username: emailOrUsername },
    });
  }

  if (user && (await verifyPassword(password, user.password))) {
    await createSession(user, res);

    return res.status(200).json({
      message: "Logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
    });
  }

  return res.status(401).json({ message: "Invalid credentials" });
}
