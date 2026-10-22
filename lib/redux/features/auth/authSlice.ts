import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { AdminUser, AuthState } from "@/types/auth.types";

const AUTH_COOKIE_KEY = "mayogo_auth_session";

const getSavedToken = (): string | null => {
  if (typeof window !== "undefined") {
    return Cookies.get(AUTH_COOKIE_KEY) || null;
  }
  return null;
};

const savedToken = getSavedToken();

const initialState: AuthState = {
  user: null,
  accessToken: savedToken,
  isAuthenticated: !!savedToken,
  isLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AdminUser; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      Cookies.set(AUTH_COOKIE_KEY, action.payload.accessToken, {
        expires: 7,
        sameSite: "lax",
        path: "/",
      });
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      Cookies.set(AUTH_COOKIE_KEY, action.payload, {
        expires: 7,
        sameSite: "lax",
        path: "/",
      });
    },
    setUser: (state, action: PayloadAction<AdminUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    updateUser: (state, action: PayloadAction<Partial<AdminUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      Cookies.remove(AUTH_COOKIE_KEY, { path: "/" });
    },
  },
});

export const {
  setCredentials,
  setAccessToken,
  setUser,
  updateUser,
  setAuthLoading,
  logout,
} = authSlice.actions;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;

export default authSlice.reducer;
