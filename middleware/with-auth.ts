import { NextApiResponse } from "next";
import { ExtendedNextApiRequest } from "../types/next";
import { destroySession, verifyAndDecodeToken } from "../lib/api-utils/auth";
import prisma from "../lib/prisma";
import authenticate from "../lib/api-utils/authenticate";

export default function withAuth(
  next: (req: ExtendedNextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async function handler(
    req: ExtendedNextApiRequest,
    res: NextApiResponse
  ) {
    const user = await authenticate(req, res);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    return await next(req, res);
  };
}
