import * as yup from "yup";

export interface ProjectForm {
  title: string;
  description?: string | null;
}

export const projectSchema: yup.SchemaOf<ProjectForm> = yup.object().shape({
  title: yup.string().max(20).required(),
  description: yup.string().max(100).nullable(true),
});
