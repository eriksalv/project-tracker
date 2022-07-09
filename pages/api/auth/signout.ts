import { NextApiRequest, NextApiResponse } from "next";
import { destroySession } from "../../../lib/api-utils/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { cookies } = req;

  const jwt = cookies.token;

  if (!jwt) {
    return res.status(401).json({ message: "Already logged out" });
  }

  await destroySession(jwt, res);

  res.status(200).json({ message: "Successfully logged out" });
}
