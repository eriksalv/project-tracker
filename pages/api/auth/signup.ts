import prisma from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { createSession, hashPassword } from "../../../lib/api-utils/auth";
import { RegisterForm, registerSchema } from "../../../lib/validation/signup";
import validate from "../../../lib/validation/validate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req;

  const { errors, data } = await validate(registerSchema, body);

  if (errors) {
    return res.status(422).json({ errors });
  }

  const { email, username, name, password } = data as RegisterForm;

  if (await prisma.user.findUnique({ where: { email } })) {
    return res.status(400).json({ message: "Email is already taken" });
  }

  if (await prisma.user.findUnique({ where: { username } })) {
    return res.status(400).json({ message: "Username is already taken" });
  }

  try {
    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: { email, username, name, password: hashedPassword },
    });

    await createSession(newUser, res);

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        name: newUser.name,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong" });
  }
}
