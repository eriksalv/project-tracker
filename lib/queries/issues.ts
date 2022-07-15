import axios from "axios";
import { Issue } from "../../types/client";

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
  if (Number.isNaN(projectId)) {
    return {
      errors: "Invalid project id",
    };
  }

  const res = await axios.get(`/api/projects/${projectId}/issues?page=${page}`);
  return res.data;
};
