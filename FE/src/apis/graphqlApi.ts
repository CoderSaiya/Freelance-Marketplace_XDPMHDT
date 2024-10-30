import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { setTokens, logout } from '../features/authSlice';
import { ProjectImageResponse, ProjectResponseType, ProjectWithImage } from '../types/ProjectType';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}`,
  prepareHeaders: (headers) => {
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
            graphqlApi.endpoints.refreshToken.initiate({ accessToken: null, refreshToken })
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

export const graphqlApi = createApi({
  reducerPath: 'graphqlApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createProject: builder.mutation<ProjectResponseType, { project: any }>({
      query: ({ project }) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            mutation createProject($project: ProjectInput!) {
              createProject(project: $project) {
                projectId
                projectName
                projectDescription
                budget
                deadline
                skillRequire
                status
                createAt
                category {
                  categoryId
                  categoryName
                }
              }
            }
          `,
          variables: { project },
        },
      }),
    }),
    getProject: builder.query<ProjectImageResponse, void>({
      query: () => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            query {
              projects {
                projectId
                projectName
                projectDescription
                budget
                deadline
                skillRequire
                status
                createAt
                category {
                  categoryId
                  categoryName
                }
                imageUrls
              }
            }
          `,
        },
      }),
    }),
    refreshToken: builder.mutation<{ accessToken: string; refreshToken: string }, { accessToken: string | null; refreshToken: string | null }>({
      query: (tokens) => ({
        url: 'api/Auth/refresh-token',
        method: 'POST',
        body: tokens,
      }),
    }),
  }),
});

export const { useCreateProjectMutation, useGetProjectQuery } = graphqlApi;
