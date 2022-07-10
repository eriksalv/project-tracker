import * as yup from "yup";

export interface CreateProjectForm {
  title: string;
  description?: string | null;
}

export const createProjectSchema: yup.SchemaOf<CreateProjectForm> = yup
  .object()
  .shape({
    title: yup.string().trim().min(1).max(20).required(),
    description: yup.string().trim().max(100).nullable(true),
  });

export interface UpdateProjectForm {
  title?: string;
  description?: string | null;
}

export const updateProjectSchema: yup.SchemaOf<UpdateProjectForm> = yup
  .object()
  .shape({
    title: yup.string().trim().min(1).max(20),
    description: yup.string().trim().max(100).nullable(true),
  });
