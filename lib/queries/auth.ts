import axios from "axios";
import { User } from "../client-types";
import { LoginForm } from "../validation/signin";
import { RegisterForm } from "../validation/signup";

export interface AuthResponse {
  user?: User;
  accessToken?: {
    userId: number;
    success: boolean;
    token: string;
  };
  message?: string;
  errors?: string | string[];
}

export const signin = async (
  signinRequest: LoginForm
): Promise<AuthResponse> => {
  const res = await axios.post("/api/auth/signin", signinRequest);
  return res.data;
};

export const signup = async (
  signupRequest: RegisterForm
): Promise<AuthResponse> => {
  const res = await axios.post("/api/auth/signup", signupRequest);
  return res.data;
};

export const signout = async (): Promise<AuthResponse> => {
  const res = await axios.post("/api/auth/signout");
  return res.data;
};
