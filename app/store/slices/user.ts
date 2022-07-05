import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export interface UserState {
  users:
    | {
        id: number;
        email: string;
        username: string;
      }[]
    | null;
  status: "loading" | "success" | "error";
  errors: string[] | null;
}

const initialState: UserState = {
  users: null,
  status: "success",
  errors: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: () => initialState,
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { reset, setUsers } = userSlice.actions;

export default userSlice.reducer;
