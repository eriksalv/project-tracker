import { Project } from "../../types/client";
import axios from "axios";
import { CreateProjectForm } from "../validation/project";

export interface ProjectResponse {
  project?: Project;
  projects?: Project[];
  message?: string;
  errors?: string | string[];
}

export const createProject = async (
  data: CreateProjectForm
): Promise<ProjectResponse> => {
  const res = await axios.post(`/api/projects`, data);
  return res.data;
};

export const getProject = async (
  id: string | string[] | undefined
): Promise<ProjectResponse> => {
  if (Number.isNaN(id)) {
    return {
      errors: "Invalid project id",
    };
  }

  const res = await axios.get(`/api/projects/${id}`);
  return res.data;
};
