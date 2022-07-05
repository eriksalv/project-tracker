import axios from "axios";
import { LoginForm } from "../lib/validation/signin";
import { RegisterForm } from "../lib/validation/signup";
import create from "zustand";

export interface AuthState {
  user: {
    id: number;
    email: string;
    username: string;
  } | null;
  status: "success" | "error" | "";
  loading: boolean;
  signin: (credentials: LoginForm) => void;
  signup: (userData: RegisterForm) => void;
}

const getDefaultInitialState = () => ({
  user: null,
  status: "" as AuthState["status"],
  loading: false,
});

const useAuthStore = create<AuthState>((set, get) => ({
  ...getDefaultInitialState(),
  signin: async (credentials) => {
    try {
      set({ loading: true, status: "" });
      const res = await axios.post("/api/auth/signin", credentials);
      set({ user: res.data.user, status: "success", loading: false });
    } catch (error) {
      set({ user: null, status: "error", loading: false });
    }
  },
  signup: async (userData) => {
    try {
      set({ loading: true, status: "" });
      const res = await axios.post("/api/auth/signup", userData);
      set({ user: res.data.user, status: "success", loading: false });
    } catch (error) {
      set({ user: null, status: "error", loading: false });
    }
  },
}));

export default useAuthStore;
