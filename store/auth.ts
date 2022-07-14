import create from "zustand";
import { User } from "../types/client";
import { AuthResponse } from "../lib/queries/auth";
import { devtools } from "zustand/middleware";

export interface AuthState {
  user: User | null;
  signin: (data: AuthResponse) => void;
  logout: () => void;
}

const getDefaultInitialState = () => ({
  user: null,
});

const useAuthStore = create<AuthState, any>(
  devtools((set, get) => ({
    ...getDefaultInitialState(),
    signin: (data) => {
      set({ user: data.user });
    },
    logout: () => {
      set({ user: null });
    },
  }))
);

export default useAuthStore;
