import { NextApiRequest, NextApiResponse } from "next";
import { verifyPassword } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { LoginForm, loginSchema } from "../../../lib/validation/signin";
import validate from "../../../lib/validation/validate";
import { AuthResponse } from "../../../lib/queries/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  switch (req.method) {
    case "POST":
      await handlePOST(req, res);
      break;
    default:
      return res.status(405).json({
        user: null,
        errors: null,
        message: `The HTTP method ${req.method} is not supported for this route.`,
      });
  }
}

async function handlePOST(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  const { body } = req;

  const { data, errors } = await validate(loginSchema, body);

  if (errors) {
    return res.status(422).json({ user: null, errors, message: null });
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
    return res.status(200).json({
      message: "Logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
      errors: null,
    });
  }

  return res
    .status(401)
    .json({ user: null, errors: null, message: "Invalid credentials" });
}
