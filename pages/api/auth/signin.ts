import { NextApiRequest, NextApiResponse } from "next";
import {
  createSession,
  getAuthTokenId,
  verifyPassword,
} from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { LoginForm, loginSchema } from "../../../lib/validation/signin";
import validate from "../../../lib/validation/validate";
import { AuthResponse } from "../../../lib/queries/auth";
import cookie from "cookie";

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

  const userId = jwt && (await getAuthTokenId(jwt));

  if (userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: +userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Something went wrong" });
    }

    return res.status(200).json({
      message: "Already signed in",
      accessToken: { success: true, userId: +userId, token: jwt },
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
      },
    });
  }

  if (jwt && !userId) {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0),
        sameSite: "strict",
        path: "/",
      })
    );
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
    const accessToken = await createSession(user);

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", accessToken.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "strict",
        path: "/",
      })
    );

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
