import { Star } from "@prisma/client";
import axios from "axios";
import isInt from "../api-utils/isInt";

export interface StarResponse {
  starCount?: number;
  hasStarred?: boolean;
  userStar?: Star;
  message?: string;
}

export const getStar = async (
  projectId: string | string[] | undefined
): Promise<StarResponse> => {
  if (!isInt(projectId)) {
    throw new Error("Invalid project id");
  }

  const res = await axios.get(`/api/projects/${projectId}/stars`);
  return res.data;
};

export const starProject = async (projectId: number): Promise<StarResponse> => {
  const res = await axios.post(`/api/projects/${projectId}/stars`);
  return res.data;
};

export const unstarProject = async (
  projectId: number
): Promise<StarResponse> => {
  const res = await axios.delete(`/api/projects/${projectId}/stars`);
  return res.data;
};
