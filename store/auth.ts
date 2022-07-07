import create from "zustand";
import { User } from "../lib/client-types";
import { AuthResponse } from "../lib/queries/auth";
import { devtools } from "zustand/middleware";

export interface AuthState {
  user: User | null;
  onError: () => void;
  onSuccess: (data: AuthResponse) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const getDefaultInitialState = () => ({
  user: null,
});

const useAuthStore = create<AuthState, any>(
  devtools((set, get) => ({
    ...getDefaultInitialState(),
    onError: () => {
      set({ user: null });
    },
    onSuccess: (data) => {
      set({ user: data.user });
    },
    logout: () => {
      //TODO: remove localstorage
      set({ user: null });
    },
    isAuthenticated: () => !!get().user,
  }))
);

export default useAuthStore;
