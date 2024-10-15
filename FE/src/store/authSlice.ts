import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login, refreshToken } from '../services/authService';

interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Action to refresh the token
export const refreshUserToken = createAsyncThunk('auth/refreshToken', async (_refreshToken: string) => {
  const response = await refreshToken(_refreshToken);
  return response.token;
});

// Action to login the user
export const loginUser = createAsyncThunk('auth/loginUser', async ({ username, password }: { username: string; password: string }) => {
  return await login(username, password);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(refreshUserToken.fulfilled, (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
