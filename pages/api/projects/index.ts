import type { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../../../lib/api-utils/authenticate";
import prisma from "../../../lib/prisma";
import { ProjectResponse } from "../../../lib/queries/projects";
import {
  CreateProjectForm,
  createProjectSchema,
} from "../../../lib/validation/project";
import validate from "../../../lib/validation/validate";
import {
  projectArgs,
  projectWithBoardArgs,
  userArgs,
} from "../../../lib/db-utils";
import { Prisma } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProjectResponse>
) {
  switch (req.method) {
    case "GET":
      return await handleGET(res);
    case "POST":
      return await handlePOST(req, res);
    default:
      return res.status(405).json({
        message: `The HTTP method ${req.method} is not supported for this route.`,
      });
  }
}

async function handleGET(res: NextApiResponse) {
  const projects = await prisma.project.findMany(projectArgs);
  return res.status(200).json({ projects });
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

  const { title, description, public: isPublic } = data as CreateProjectForm;

  try {
    const project = await prisma.project.create({
      data: {
        title,
        description,
        public: isPublic,
        owner: {
          connect: {
            id: user.id,
          },
        },
        board: {
          create: {
            contributors: {
              create: [
                {
                  user: {
                    connect: {
                      id: user.id,
                    },
                  },
                },
              ],
            },
          },
        },
      },
      ...projectWithBoardArgs,
    });

    return res
      .status(201)
      .json({ project, message: "Project created successfully" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(409).json({
          message: "You already have a project with this title.",
        });
      }
    }

    return res.status(200).json({
      message: "Something went wrong",
    });
  }
}
