import axios from "axios";
import { User } from "../client-types";
import { UpdateProfileForm } from "../validation/update-profile";

export interface UserResponse {
  user?: User;
  users?: User[];
  message?: string;
  errors?: string | string[];
}

export const getUser = async (username: string): Promise<UserResponse> => {
  const res = await axios.get(`/api/users/${username}`);
  return res.data;
};

export const getUsers = async (): Promise<UserResponse> => {
  const res = await axios.get("/api/users");
  return res.data;
};

export const updateProfile = async (
  username: string,
  updateProfileRequest: UpdateProfileForm
): Promise<UserResponse> => {
  const res = await axios.put(`api/users/${username}`, updateProfileRequest);
  return res.data;
};
