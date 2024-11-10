import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { setTokens, logout } from '@/features/authSlice';
import { ChatMessage } from '@/types/ChatMessage';
import { RegisterReq, ResponseRestful } from '@/types';

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

  // Handle 401 Unauthorized with non-JSON response
  if (result.error) {
    const isParsingError = result.error.status === 'PARSING_ERROR';
    const isUnauthorized = result.error.originalStatus === 401;

    if (isParsingError && isUnauthorized) {
      // If response is plain text Unauthorized, handle it without parsing
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();

        try {
          const refreshToken = localStorage.getItem('refresh');
          const accessToken = localStorage.getItem('access_token');

          if (!refreshToken || !accessToken) {
            api.dispatch(logout());
            return result;
          }

          const refreshResult = await baseQuery(
            {
              url: 'Auth/refresh-token',
              method: 'POST',
              body: {
                accessToken,
                refreshToken,
              },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const data = refreshResult.data as { accessToken: string; refreshToken: string };
            localStorage.setItem('access_token', data.accessToken);
            localStorage.setItem('refresh', data.refreshToken);
            api.dispatch(setTokens({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            }));

            // Retry the original request with the new token
            result = await baseQuery(args, api, extraOptions);
          } else {
            // api.dispatch(logout());
          }
        } finally {
          release();
        }
      } else {
        await mutex.waitForUnlock();
        result = await baseQuery(args, api, extraOptions);
      }
    } else if (result.error.status === 401) {
      // If it's a regular 401 error, proceed with re-authentication flow
      api.dispatch(logout());
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
    registerUser: builder.mutation<ResponseRestful<null>, RegisterReq>({
      query: (registerReq) => ({
        url: 'Auth/register',
        method: 'POST',
        body: registerReq
      })
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
    uploadImg: builder.mutation<{ imageUrl: string }, FormData>({
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
    stripePayment: builder.mutation({
      query: ({ amount, userId }) => ({
        url: 'Stripe/create-payment-intent',
        method: 'POST',
        body: { amount, userId }
      })
    })
  }),
});

export const { useLoginUserMutation, useRegisterUserMutation, useLoginGoogleMutation, useUploadImgMutation, useSendMessageMutation, useSendAllMutation, useGetChatHistoryQuery, useStripePaymentMutation } = restfulApi;
