import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { setTokens, logout } from '../features/authSlice';
import { ChatMessage } from '../types/ChatMessage';

interface GoogleSignInResponse {
  url: string;
}

interface GoogleAuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

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
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const refreshResult = await api.dispatch(
            restfulApi.endpoints.refreshToken.initiate({ accessToken: null, refreshToken })
          );

          const newAccessToken = refreshResult.data?.accessToken;
          const newRefreshToken = refreshResult.data?.refreshToken;

          if (newAccessToken && newRefreshToken) {
            api.dispatch(setTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken }));
            localStorage.setItem('access_token', newAccessToken);
            localStorage.setItem('refresh_token', newRefreshToken);

            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(logout());
          }
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
    // loginGoogle: builder.query<void, void>({
    //   query: () => ({
    //     url: 'Auth/signin-google',
    //     method: 'GET',
    //     mode: 'no-cors',
    //   }),
    // }),
    // googleCallback: builder.query<void, string>({
    //   query: (code) => `Auth/google-response?code=${code}`,
    // }),
    loginGoogle: builder.mutation<void, void>({
      query: (googleResponseCode) => ({
        url: 'Auth/google-response', // Endpoint to exchange Google token
        method: 'POST',
        body: { code: googleResponseCode }, // Include the Google response code in the body
      }),
    }),
    refreshToken: builder.mutation<{ data: { accessToken: string; refreshToken: string } }, { accessToken: string | null; refreshToken: string | null }>({
      query: (tokens) => ({
        url: 'Auth/refresh-token',
        method: 'POST',
        body: tokens,
      }),
    }),
    uploadImg: builder.mutation<{ ImageUrl: string }, FormData>({
      query: (formData) => ({
        url: 'Img',
        method: 'POST',
        body: formData,
      })
    }),
    sendAll: builder.mutation<void, { user: string; message: string }>({
      query: ({ user, message }) => ({
        url: 'Chat/sendAll',
        method: 'POST',
        body: { user, message },
      }),
    }),
    getChatHistory: builder.query<ChatMessage[], { user1: string; user2: string }>({
      query: ({ user1, user2 }) => `Chat/history?user1=${user1}&user2=${user2}`,
    }),
    sendMessage: builder.mutation<void, { sender: string; recipient: string; message: string }>({
      query: ({ sender, recipient, message }) => ({
        url: 'Chat/send',
        method: 'POST',
        body: { sender, recipient, message },
      }),
    }),
  }),
});

export const { useLoginUserMutation, useLoginGoogleMutation, useUploadImgMutation, useSendMessageMutation, useSendAllMutation, useGetChatHistoryQuery } = restfulApi;
