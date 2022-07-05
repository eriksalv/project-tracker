import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface AuthState {
  user: {
    id: number;
    email: string;
    username: string;
  } | null;
  status: "loading" | "success" | "error";
  errors: string[] | null;
}

const initialState: AuthState = {
  user: null,
  status: "success",
  errors: null,
};

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const res = await axios.post("/api/signup", data);
    return res.data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "success";
        state.errors = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "error";
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
