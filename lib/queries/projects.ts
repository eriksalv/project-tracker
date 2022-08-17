import { Project } from "../../types/client";
import axios from "axios";
import { CreateProjectForm } from "../validation/project";
import isInt from "../api-utils/isInt";

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
  if (!isInt(id)) {
    throw new Error("Invalid project id");
  }

  const res = await axios.get(`/api/projects/${id}`);
  return res.data;
};

export const getUserProjects = async (
  userId: string | string[] | undefined,
  limit?: number
): Promise<ProjectResponse> => {
  if (!isInt(userId)) {
    throw new Error("Invalid user id");
  }

  const res = await axios.get(
    `/api/users/${userId}/projects?limit=${limit ? limit : ""}`
  );
  return res.data;
};

export const getUserContributions = async (
  userId: string | string[] | undefined,
  limit?: number
): Promise<ProjectResponse> => {
  if (!isInt(userId)) {
    throw new Error("Invalid user id");
  }

  const res = await axios.get(
    `/api/users/${userId}/projects/contributing?limit=${limit ? limit : ""}`
  );
  return res.data;
};
