import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import redis from "../../../lib/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { cookies } = req;

  const jwt = cookies.token;

  if (!jwt) {
    return res.status(401).json({ message: "Already logged out" });
  }

  res.setHeader(
    "Set-Cookie",
    serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      sameSite: "strict",
      path: "/",
    })
  );

  await redis.del(jwt);

  res.status(200).json({ message: "Successfully logged out" });
}
