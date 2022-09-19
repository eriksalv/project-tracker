import create from "zustand";
import { User } from "../types/client";
import { AuthResponse } from "../lib/queries/auth";

export interface AuthState {
  user: User | null;
  signin: (data: AuthResponse) => void;
  logout: () => void;
}

const getDefaultInitialState = () => ({
  user: null,
});

const useAuthStore = create<AuthState, any>((set) => ({
  ...getDefaultInitialState(),
  signin: (data) => {
    set({ user: data.user });
  },
  logout: () => {
    set({ user: null });
  },
}));

export default useAuthStore;
