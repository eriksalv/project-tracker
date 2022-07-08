import create from "zustand";
import { User } from "../lib/client-types";
import { AuthResponse } from "../lib/queries/auth";
import { devtools } from "zustand/middleware";

export interface AuthState {
  user: User | null;
  accessToken: {
    success: boolean;
    userId: number;
    token: string;
  } | null;
  signin: (data: AuthResponse) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const getDefaultInitialState = () => ({
  user: null,
  accessToken: null,
});

const useAuthStore = create<AuthState, any>(
  devtools((set, get) => ({
    ...getDefaultInitialState(),
    signin: (data) => {
      localStorage.setItem("token", JSON.stringify(data.accessToken?.token!));
      set({ user: data.user, accessToken: data.accessToken });
    },
    logout: () => {
      localStorage.removeItem("token");
      set({ user: null, accessToken: null });
    },
    isAuthenticated: () => !!get().accessToken,
  }))
);

export default useAuthStore;
