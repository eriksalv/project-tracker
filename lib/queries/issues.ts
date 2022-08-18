import axios from "axios";
import { Issue } from "../../types/client";
import isInt from "../api-utils/isInt";
import { CreateIssueForm, UpdateIssueForm } from "../validation/issue";

export type IssueResponse = {
  issue?: Issue;
  issues?: Issue[];
  count?: number;
  message?: string;
  errors?: string | string[];
};

export const getIssues = async (
  projectId: string | string[] | undefined,
  page: number
): Promise<IssueResponse> => {
  if (!isInt(projectId)) {
    throw new Error("Invalid project id");
  }

  const res = await axios.get(`/api/projects/${projectId}/issues?page=${page}`);
  return res.data;
};

export const createIssue = async (
  data: CreateIssueForm,
  projectId: string | string[] | undefined
): Promise<IssueResponse> => {
  if (!isInt(projectId)) {
    throw new Error("Invalid project id");
  }

  const res = await axios.post(`/api/projects/${projectId}/issues`, data);
  return res.data;
};

export const getIssue = async (
  projectId: string | string[] | undefined,
  issueId: string | string[] | undefined
): Promise<IssueResponse> => {
  if (!isInt(issueId)) {
    throw new Error("Invalid issue id");
  }
  if (!isInt(projectId)) {
    throw new Error("Invalid project id");
  }

  const res = await axios.get(`/api/projects/${projectId}/issues/${issueId}`);
  return res.data;
};

export const updateIssue = async (
  issueId: string | string[] | undefined,
  projectId: string | string[] | undefined,
  data: UpdateIssueForm
): Promise<IssueResponse> => {
  if (!isInt(issueId)) {
    throw new Error("Invalid issue id");
  }
  if (!isInt(projectId)) {
    throw new Error("Invalid project id");
  }

  const res = await axios.put(
    `/api/projects/${projectId}/issues/${issueId}`,
    data
  );
  return res.data;
};

export const deleteIssue = async (
  issueId: string | string[] | undefined,
  projectId: string | string[] | undefined
): Promise<IssueResponse> => {
  if (!isInt(issueId)) {
    throw new Error("Invalid issue id");
  }
  if (!isInt(projectId)) {
    throw new Error("Invalid project id");
  }

  const res = await axios.delete(
    `/api/projects/${projectId}/issues/${issueId}`
  );
  return res.data;
};
