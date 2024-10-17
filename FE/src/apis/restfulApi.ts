import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { setTokens, logout } from '../features/authSlice';

const BASE_URL = "https://localhost:7115";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        // Dispatch refreshToken mutation to get new token
        const refreshResult = await api.dispatch(restfulApi.endpoints.refreshToken.initiate());
        const newToken = refreshResult?.data?.accessToken;

        if (newToken) {
          // Update token in Redux store
          api.dispatch(setTokens({ accessToken: newToken }));

          // Retry the original query with the new access token
          result = await baseQuery(args, api, extraOptions);
        } else {
          // If refresh fails, log out
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

// Create the API
export const restfulApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    loginUser: builder.mutation<{ accessToken: string; refreshToken: string }, { username: string; password: string }>({
      query: (credentials) => ({
        url: 'Auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    refreshToken: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: 'Auth/refresh-token',
        method: 'POST',
      }),
    }),
  }),
});

export const { useLoginUserMutation } = restfulApi;
