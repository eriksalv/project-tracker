import type { NextApiResponse } from "next";
import { projectArgs } from "../../../../lib/db-utils";
import prisma from "../../../../lib/prisma";
import { ProjectResponse } from "../../../../lib/queries/projects";
import {
  UpdateProjectForm,
  updateProjectSchema,
} from "../../../../lib/validation/project";
import withAuth from "../../../../middleware/with-auth";
import withProject from "../../../../middleware/with-project";
import withValidation from "../../../../middleware/with-validation";
import { ExtendedNextApiRequest } from "../../../../types/next";

async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<ProjectResponse>
) {
  switch (req.method) {
    case "GET":
      return await handleGET(req, res);
    case "PUT":
      return await withValidation(withAuth(handlePUT), updateProjectSchema)(
        req,
        res
      );
    case "DELETE":
      return await withAuth(handleDELETE)(req, res);
    default:
      return res.status(405).json({
        message: `The HTTP method ${req.method} is not supported for this route.`,
      });
  }
}

async function handleGET(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const project = req.project!;

  return res.status(200).json({ project });
}

async function handlePUT(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const data = req.data;
  const user = req.user;
  const project = req.project;

  if (user?.id != project?.ownerId) {
    return res
      .status(403)
      .json({ message: "You do not have permissions to update this project" });
  }

  const { id } = req.project!;

  const { title, description, public: isPublic } = data as UpdateProjectForm;

  try {
    const project = await prisma.project.update({
      where: {
        id,
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

async function handleDELETE(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const { id } = req.project!;
  const user = req.user;
  const project = req.project;

  if (user?.id != project?.ownerId) {
    return res
      .status(403)
      .json({ message: "You do not have permissions to delete this project" });
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

export default withProject(handler);
