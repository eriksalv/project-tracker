import type { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../../../lib/api-utils/authenticate";
import { projectArgs } from "../../../lib/db-utils";
import prisma from "../../../lib/prisma";
import { ProjectResponse } from "../../../lib/queries/projects";
import {
  UpdateProjectForm,
  updateProjectSchema,
} from "../../../lib/validation/project";
import validate from "../../../lib/validation/validate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProjectResponse>
) {
  switch (req.method) {
    case "GET":
      return await handleGET(req, res);
    case "PUT":
      return await handlePUT(req, res);
    case "DELETE":
      return await handleDELETE(req, res);
    default:
      return res.status(405).json({
        message: `The HTTP method ${req.method} is not supported for this route.`,
      });
  }
}

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const project = await prisma.project.findUnique({
    where: {
      id: +id!,
    },
    ...projectArgs,
  });

  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }

  return res.status(200).json({ project });
}

async function handlePUT(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticate(req, res);

  if (!user) {
    return res.status(401).json({
      message: "You must be logged in to update a project.",
    });
  }

  const { id } = req.query;

  const project = await prisma.project.findUnique({
    where: { id: +id! },
  });

  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }

  if (project.ownerId !== user.id) {
    return res.status(403).json({
      message: "You do not have permission to update this project.",
    });
  }

  const { body } = req;

  const { data, errors } = await validate(updateProjectSchema, body);

  if (errors) {
    return res.status(422).json({ errors });
  }

  const { title, description, public: isPublic } = data as UpdateProjectForm;

  try {
    const project = await prisma.project.update({
      where: {
        id: +id!,
      },
      data: {
        title,
        description,
        public: isPublic,
      },

      ...projectArgs,
    });

    return res.status(200).json({ project });
  } catch (e) {
    return res.status(500).json({
      message: "Error updating project",
    });
  }
}

async function handleDELETE(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticate(req, res);

  if (!user) {
    return res.status(401).json({
      message: "You must be logged in to delete a project.",
    });
  }

  const { id } = req.query;

  const project = await prisma.project.findUnique({ where: { id: +id! } });

  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }

  if (project.ownerId !== user.id) {
    return res.status(403).json({
      message: "You do not have permission to delete this project.",
    });
  }

  try {
    await prisma.project.delete({ where: { id: +id! } });

    return res.status(200).json({
      message: "Project deleted",
    });
  } catch (e) {
    return res.status(500).json({
      message: "Error deleting project",
    });
  }
}
