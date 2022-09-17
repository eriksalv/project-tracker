import axios from "axios";
import { Contributor } from "../../types/client";
import isInt from "../api-utils/isInt";

export interface ContributorResponse {
  Contributor?: Contributor;
  Contributors?: Contributor[];
  message?: string;
  errors?: string | string[];
}

export const getContributor = async (
  projectId: string | string[] | undefined,
  contributorId: string | string[] | undefined
): Promise<ContributorResponse> => {
  if (!isInt(projectId)) {
    throw new Error("Invalid project id");
  }

  if (!isInt(contributorId)) {
    throw new Error("Invalid contributor id");
  }

  const res = await axios.get(
    `/api/projects/${projectId}/contributors/${contributorId}`
  );
  return res.data;
};

export const getContributors = async (
  projectId: string | string[] | undefined
): Promise<ContributorResponse> => {
  if (!isInt(projectId)) {
    throw new Error("Invalid project id");
  }

  const res = await axios.get(`/api/projects/${projectId}/contributors`);
  return res.data;
};

export const addContributor = async (
  projectId: string | string[] | undefined,
  userId: number
): Promise<ContributorResponse> => {
  if (!isInt(projectId)) {
    throw new Error("Invalid project id");
  }

  const res = await axios.post(
    `/api/projects/${projectId}/contributors/${userId}`
  );
  return res.data;
};

export const removeContributor = async (
  projectId: string | string[] | undefined,
  contributorId: number
): Promise<ContributorResponse> => {
  if (!isInt(projectId)) {
    throw new Error("Invalid project id");
  }

  const res = await axios.delete(
    `/api/projects/${projectId}/contributors/${contributorId}`
  );
  return res.data;
};
