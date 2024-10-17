import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import { restfulApi } from '../apis/restfulApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [restfulApi.reducerPath]: restfulApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(restfulApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;