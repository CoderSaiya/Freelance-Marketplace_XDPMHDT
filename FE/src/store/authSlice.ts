import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userId: number;
  username: string;
  role: string;
}

const initialState: AuthState = {
  userId: 0,
  username: "",
  role: "",
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ userId: number; username: string; role: string }>) {
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.role = action.payload.role;
    },
    clearUser(state) {
      state.userId = 0;
      state.username = "";
      state.role = "";
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
