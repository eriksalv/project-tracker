import create from "zustand";
import User from "../lib/client-types/user";
import { devtools } from "zustand/middleware";

export interface UsersState {
  user: User | null;
  users: Set<User> | null;
  setUser: (user: User | null) => void;
  setUsers: (users: Set<User> | null) => void;
  addUsers: (users: User[]) => void;
}

const getDefaultInitialState = () => ({
  user: null,
  users: null,
});

const useUsersStore = create<UsersState, any>(
  devtools((set, get) => ({
    ...getDefaultInitialState(),
    setUser: (user) => {
      set({ user });
    },
    setUsers: (users) => {
      set({ users });
    },
    addUsers: (newUsers) => {
      const users = get().users;

      if (users) {
        newUsers.forEach((user) => {
          users.add(user);
        });

        set({ users });
      }
    },
  }))
);

export default useUsersStore;
