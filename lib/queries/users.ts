import axios from "axios";
import { User } from "../../types/client";
import isInt from "../api-utils/isInt";
import { UpdateProfileForm } from "../validation/update-profile";

export interface UserResponse {
  user?: User;
  users?: User[];
  message?: string;
  errors?: string | string[];
}

export const getUser = async (
  id: string | string[] | undefined
): Promise<UserResponse> => {
  if (!isInt(id)) {
    throw new Error("Invalid user id");
  }

  const res = await axios.get(`/api/users/${id}`);
  return res.data;
};

export const getUsers = async (
  search?: string,
  limit?: number
): Promise<UserResponse> => {
  const res = await axios.get(`/api/users?search=${search}&limit=${limit}`);
  return res.data;
};

export const updateProfile = async (
  updateProfileRequest: UpdateProfileForm
): Promise<UserResponse> => {
  const res = await axios.put(`/api/users/me`, updateProfileRequest);
  return res.data;
};
