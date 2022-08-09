import { NextApiResponse } from "next";
import { ExtendedNextApiRequest } from "../types/next";
import { SchemaOf } from "yup";
import validate from "../lib/validation/validate";

export default function withValidation<T = Record<string, any>>(
  next: (req: ExtendedNextApiRequest, res: NextApiResponse) => Promise<void>,
  schema: SchemaOf<T>
) {
  return async function handler(
    req: ExtendedNextApiRequest,
    res: NextApiResponse
  ) {
    const { body } = req;

    const { data, errors } = await validate(schema, body);

    if (errors) {
      return res.status(422).json({ errors });
    }

    req.data = data;

    return await next(req, res);
  };
}
