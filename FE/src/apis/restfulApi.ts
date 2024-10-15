import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.BASE_URL;

export const restfulApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api` }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
} = restfulApi;
