import { Project } from "../../types/client";
import axios from "axios";
import { CreateProjectForm, UpdateProjectForm } from "../validation/project";
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

export const updateProject = async (
  data: UpdateProjectForm,
  id: string | string[] | undefined
): Promise<ProjectResponse> => {
  if (!isInt(id)) {
    throw new Error("Invalid project id");
  }

  const res = await axios.put(`/api/projects/${id}`, data);
  return res.data;
};

export const deleteProject = async (
  id: string | string[] | undefined
): Promise<ProjectResponse> => {
  if (!isInt(id)) {
    throw new Error("Invalid project id");
  }

  const res = await axios.delete(`/api/projects/${id}`);
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
  userId: string | string[] | number | undefined,
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

export const getStarredProjects = async (
  userId: string | string[] | undefined,
  limit?: number
): Promise<ProjectResponse> => {
  if (!isInt(userId)) {
    throw new Error("Invalid user id");
  }

  const res = await axios.get(
    `/api/users/${userId}/projects/starred?limit=${limit ? limit : ""}`
  );
  return res.data;
};
