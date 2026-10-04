import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  token: string | null;
}

const getStoredUser = (): any | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "undefined" || raw === "null") return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null") return null;
  return token;
};

const initialState: AuthState = {
  user: getStoredUser(),
  token: getStoredToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: any; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user ?? null;
      state.token = token ?? null;
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    updateUser: (state, action: PayloadAction<any>) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: any) => state.auth.user;
export const selectCurrentToken = (state: any) => state.auth.token;
