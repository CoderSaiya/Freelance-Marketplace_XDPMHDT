import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { setTokens, logout } from '../features/authSlice';
import { ProjectImageResponse, ProjectType } from '../types/ProjectType';
import { restfulApi } from './restfulApi'
import { ApplyInput, ApplyType } from '../types/ApplyType';
import { ResponseType } from '../types';
import { WalletType } from '../types/WalletType';
import { CategoryType } from '../types/CategoryType';
import { User } from '../types/UserType';

interface GraphQLError {
  message: string;
  extensions: {
    details: string;
    statusCode: number;
    message: string;
  };
}

interface GraphQLResponse<T> {
  data: T | null;
  errors?: GraphQLError[];
  meta?: {
    request: Request;
    response: Response;
  };
}


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

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError | GraphQLResponse<any>> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  // if (result.error) {
  //   // If there's a base query error, return as is
  //   return result;
  // }

  const responseData: GraphQLResponse<any> = result.data as GraphQLResponse<any>;

  console.log(responseData);

  // Check for GraphQL errors
  if (responseData.errors) {
    const statusCode = responseData.errors[0].extensions.statusCode;

    // Handle 401 Unauthorized error
    if (statusCode === 401) {
      console.log('401 error detected, attempting token refresh.');
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
          const refreshToken = localStorage.getItem('refresh');
          if (refreshToken) {
            const refreshResult = await api.dispatch(
              restfulApi.endpoints.refreshToken.initiate({ accessToken: localStorage.getItem('access_token'), refreshToken })
            ).unwrap();

            console.log(refreshResult);

            const newAccessToken = refreshResult.data.accessToken;
            const newRefreshToken = refreshResult.data.refreshToken;

            console.log(newAccessToken, newRefreshToken);

            if (newAccessToken && newRefreshToken) {
              api.dispatch(setTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken }));
              localStorage.setItem('access_token', newAccessToken);
              localStorage.setItem('refresh', newRefreshToken);

              // Retry the original query with the new token
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
  }

  return result;
};

export const graphqlApi = createApi({
  reducerPath: 'graphqlApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createProject: builder.mutation<ResponseType<{ createProject: ProjectType }>, { project: any }>({
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
                user {
                  id
                  username
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
                users {
                  id
                  username
                }
              }
            }
          `,
        },
      }),
    }),
    projectById: builder.query<ResponseType<{ projectById: ProjectType }>, number>({
      query: (projectId) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            query getProjectById($projectId: Int!) {
              projectById(projectId: $projectId) {
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
                users {
                  id
                  username
                  createAt
                }
              }
            }
          `,
          variables: { projectId },
        },
      }),
    }),
    createApply: builder.mutation<ResponseType<{ createApply: ApplyType }>, { apply: ApplyInput }>({
      query: ({ apply }) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            mutation createApply($apply: ApplyInput!) {
              createApply(apply: $apply) {
                applyId
                freelancerId
                clientId
                projectId
                duration
                status
                createAt
                freelancer {
                  id
                  username
                }
                client {
                  id
                  username
                }
                project {
                  projectId
                  projectName
                }
              }
            }
          `,
          variables: { apply },
        },
      }),
    }),
    hasAppliedForProject: builder.query<ResponseType<{ hasAppliedForProject: boolean }>, { projectId: number, freelancerId: number }>({
      query: ({ projectId, freelancerId }) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            query hasAppliedForProject($projectId: Int!, $freelancerId: Int!) {
              hasAppliedForProject(projectId: $projectId, freelancerId: $freelancerId)
            }
          `,
          variables: { projectId, freelancerId },
        },
      }),
    }),
    getWallet: builder.query<ResponseType<{ getWallet: WalletType }>, number>({
      query: (userId) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            query getWallet($userId: Int!) {
              getWallet(userId: $userId) {
                walletId
                balance
                user {
                  id
                }
              }
            }
          `,
          variables: { userId },
        },
      }),
    }),
    getCategory: builder.query<ResponseType<{ categories: CategoryType[] }>, void>({
      query: () => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            query {
              categories {
                categoryId
                categoryName
              }
            }
          `,
        },
      }),
    }),
    getProfile: builder.query<ResponseType<{ userById: User }>, number>({
      query: (userId) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            query getUserById($userId: Int!) {
              userById(userId: $userId) {
                id
                username
                userProfile {
                  rating
                }
              }
            }
          `,
          variables: { userId }
        },
      }),
    }),
  }),
});

export const { useCreateProjectMutation, useGetProjectQuery, useProjectByIdQuery, useCreateApplyMutation, useHasAppliedForProjectQuery, useGetWalletQuery, useGetCategoryQuery, useGetProfileQuery } = graphqlApi;
