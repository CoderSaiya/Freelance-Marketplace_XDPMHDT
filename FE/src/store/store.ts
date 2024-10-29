import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'
import { restfulApi } from '../apis/restfulApi';
import { graphqlApi } from '../apis/graphqlApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [restfulApi.reducerPath]: restfulApi.reducer,
    [graphqlApi.reducerPath]: graphqlApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(restfulApi.middleware)
      .concat(graphqlApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;