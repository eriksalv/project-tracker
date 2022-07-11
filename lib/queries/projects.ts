import { Project } from "../client-types";
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

export const getProject = async (id: number): Promise<ProjectResponse> => {
  const res = await axios.get(`/api/projects/${id}`);
  return res.data;
};
