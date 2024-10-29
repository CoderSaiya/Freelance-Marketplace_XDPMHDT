import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userId: number;
  username: string;
}

const initialState: AuthState = {
  userId: 0,
  username: "",
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ userId: number; username: string }>) {
      state.userId = action.payload.userId;
      state.username = action.payload.username;
    },
    clearUser(state) {
      state.userId = 0;
      state.username = "";
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
