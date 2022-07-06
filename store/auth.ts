import create from "zustand";
import User from "../lib/client-types/user";
import { AuthResponse } from "../lib/queries/auth";

export interface AuthState {
  user: User | null;
  onError: () => void;
  onSuccess: (data: AuthResponse) => void;
  logout: () => void;
}

const getDefaultInitialState = () => ({
  user: null,
});

const useAuthStore = create<AuthState>((set, get) => ({
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
  // signin: async (credentials) => {
  //   try {
  //     set({ loading: true, status: "" });
  //     const res = await axios.post("/api/auth/signin", credentials);
  //     set({ user: res.data.user, status: "success", loading: false });
  //   } catch (error) {
  //     set({ user: null, status: "error", loading: false });
  //   }
  // },
  // signup: async (userData) => {
  //   try {
  //     set({ loading: true, status: "" });
  //     const res = await axios.post("/api/auth/signup", userData);
  //     set({ user: res.data.user, status: "success", loading: false });
  //   } catch (error) {
  //     set({ user: null, status: "error", loading: false });
  //   }
  // },
}));

export default useAuthStore;
