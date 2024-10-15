import { configureStore } from '@reduxjs/toolkit';
import { restfulApi } from '../apis/restfulApi';

const store = configureStore({
  reducer: {
    [restfulApi.reducerPath]: restfulApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(restfulApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;