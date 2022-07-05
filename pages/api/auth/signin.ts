import { NextApiRequest, NextApiResponse } from "next";
import { verifyPassword } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { LoginForm, loginSchema } from "../../../lib/validation/signin";
import validate from "../../../lib/validation/validate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      await handlePOST(req, res);
      break;
    default:
      return res.status(405).json({
        message: `The HTTP method ${req.method} is not supported for this route.`,
      });
  }
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
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
    return res.status(200).json({
      message: "Logged in successfully",
      user: {
        email: user.email,
        username: user.username,
        name: user.name,
      },
    });
  }

  return res.status(401).json({ message: "Invalid credentials" });
}
