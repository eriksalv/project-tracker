import axios from "axios";
import User from "../client-types/user";
import { LoginForm } from "../validation/signin";
import { RegisterForm } from "../validation/signup";

export interface AuthResponse {
  user: User | null;
  message: string | null;
  errors: string | string[] | null;
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
