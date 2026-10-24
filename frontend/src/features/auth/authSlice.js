import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authService from "../../services/authService";
import { errorMessage } from "../../utils/validation";

const token = localStorage.getItem("hcm_token");

export const loginThunk = createAsyncThunk("auth/login", async (body, { rejectWithValue }) => {
  try { return await authService.loginUser(body); } catch (e) { return rejectWithValue(errorMessage(e)); }
});
export const setupThunk = createAsyncThunk("auth/setup", async (body, { rejectWithValue }) => {
  try { return await authService.setupCompany(body); } catch (e) { return rejectWithValue(errorMessage(e)); }
});
export const fetchMe = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
  try { return await authService.getMe(); } catch (e) { return rejectWithValue(errorMessage(e)); }
});

const saveSession = (state, { token: t, user }) => {
  state.token = t;
  state.user = user;
  state.status = "idle";
  localStorage.setItem("hcm_token", t);
};

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token, status: "idle", error: "", booting: Boolean(token) },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("hcm_token");
    },
    setUser: (state, action) => { state.user = action.payload; },
    clearError: (state) => { state.error = ""; },
  },
  extraReducers: (b) => {
    [loginThunk, setupThunk].forEach((thunk) => {
      b.addCase(thunk.pending, (s) => { s.status = "loading"; s.error = ""; })
        .addCase(thunk.fulfilled, (s, a) => saveSession(s, a.payload))
        .addCase(thunk.rejected, (s, a) => { s.status = "idle"; s.error = a.payload; });
    });
    b.addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload; s.booting = false; })
      .addCase(fetchMe.rejected, (s) => { s.user = null; s.token = null; s.booting = false; localStorage.removeItem("hcm_token"); });
  },
});

export const { logout, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
