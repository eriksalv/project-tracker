import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    // case "GET":
    //   return await handleGET(req, res);
    // case "PUT":
    //   return await handlePUT(req, res);
    // case "DELETE":
    //   return await handleDELETE(req, res);
    default:
      return res.status(405).json({
        message: `The HTTP method ${req.method} is not supported for this route.`,
      });
  }
}
