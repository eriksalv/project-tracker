import type { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../../../lib/api-utils/authenticate";
import prisma from "../../../lib/prisma";
import {
  CreateProjectForm,
  createProjectSchema,
} from "../../../lib/validation/project";
import validate from "../../../lib/validation/validate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      await handleGET(res);
      break;
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

async function handleGET(res: NextApiResponse) {
  const projects = await prisma.project.findMany();
  return res.status(200).json(projects);
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticate(req, res);

  if (!user) {
    return res.status(401).json({
      message: "You must be logged in to create a project.",
    });
  }

  const { body } = req;
  const { data, errors } = await validate(createProjectSchema, body);

  if (errors) {
    return res.status(422).json({ errors });
  }

  const { title, description } = data as CreateProjectForm;

  try {
    const project = await prisma.project.create({
      data: {
        title,
        description,
        owner: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return res
      .status(201)
      .json({ project, message: "Project created successfully" });
  } catch (error) {
    return res.status(200).json({
      message: "Something went wrong",
    });
  }
}
