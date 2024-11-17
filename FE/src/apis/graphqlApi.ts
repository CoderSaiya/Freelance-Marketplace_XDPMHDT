import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { setTokens, logout } from '../features/authSlice';
import { ProjectType, ProjectWithImage } from '../types/ProjectType';
import { restfulApi } from './restfulApi'
import { ApplyInput, ApplyType } from '../types/ApplyType';
import { CateogoryPercent, ProjectStatusCount, ResponseType, Revenue, StatisticsType } from '../types';
import { WalletType } from '../types/WalletType';
import { CategoryType } from '../types/CategoryType';
import { User, UserProfileInput, UserProfileType } from '../types/UserType';
import { Contract } from '@/types/ContractType';
import { NotificationType } from '@/types/NotificationType';
import { ReviewInput, ReviewType } from '@/types/ReviewType';

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
console.log(BASE_URL)
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

  console.log(result);

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
                users {
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
    getProject: builder.query<ResponseType<{ projects: ProjectWithImage }>, void>({
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
                  userProfile {
                    avatar
                    rating
                  }
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
                  userProfile {
                    rating
                  }
                }
                applies {
                  applyId
                  duration
                  freelancer {
                    username
                    userProfile {
                      avatar
                      rating
                    }
                    review {
                      rating
                    }
                  }
                }
              }
            }
          `,
          variables: { projectId },
        },
      }),
    }),
    projectByClient: builder.query<ResponseType<{ projectByClient: ProjectType[] }>, number>({
      query: (clientId) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            query getProjectByClientId($clientId: Int!) {
              projectByClient(clientId: $clientId) {
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
                applies {
                  applyId
                  status
                  createAt
                  freelancer {
                    username
                    createAt
                    email
                    userProfile {
                      rating
                      phone
                    }
                  }
                }
              }
            }
          `,
          variables: { clientId },
        },
      }),
    }),
    getApplies: builder.query<ResponseType<{ applies: ApplyType[] }>, void>({
      query: () => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            query {
              applies {
                applyId
                freelancerId
                projectId
                duration
                status
                freelancer {
                  username
                }
                client {
                  username
                }
              }
            }
          `,
        },
      }),
    }),
    getApplyByFreelancer: builder.query<ResponseType<{ applyByFreelancerId: ApplyType[] }>, number>({
      query: (freelancerId) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            query getApplyByFreelancer($freelancerId : Int!) {
              applyByFreelancerId(freelancerId : $freelancerId) {
                applyId
                freelancerId
                projectId
                duration
                status
                createAt
                freelancer {
                  username
                  email
                  userProfile {
                    rating
                    phone
                  }
                }
                project {
                  projectId
                  projectName
                  budget
                  status
                  users {
                    username
                    id
                  }
                }
              }
            }
          `,
          variables: { freelancerId },
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
    acceptApply: builder.mutation<ResponseType<{ acceptApply: boolean }>, number>({
      query: (applyId) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            mutation AcceptApply($applyId: Int!) {
              acceptApply(applyId: $applyId)
            }
          `,
          variables: { applyId },
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
                  username
                }
              }
            }
          `,
          variables: { userId },
        },
      }),
    }),
    updateWalletBalance: builder.mutation<ResponseType<{ updateWalletBalance: WalletType }>, { userId: number; amount: number }>({
      query: ({ userId, amount }) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            mutation UpdateWalletBalance($userId: Int!, $amount: Decimal!) {
              updateWalletBalance(userId: $userId, amount: $amount) {
                walletId
              }
            }
          `,
          variables: { userId, amount },
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
    getUsers: builder.query<ResponseType<{ users: User[] }>, void>({
      query: () => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            query {
              users {
                id
                username
                role
                status
                email
                projects {
                  projectId
                  budget
                }
                userProfile {
                  phone
                  skill
                }
              }
            }
          `,
        },
      }),
    }),
    userById: builder.query<ResponseType<{ userById: User }>, number>({
      query: (userId) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            query getUserById($userId: Int!) {
              userById(userId: $userId) {
                id
                username
                email
                status
                userProfile {
                  rating
                  company
                  phone
                  birthday
                  gender
                  location
                }
              }
            }
          `,
          variables: { userId },
        },
      }),
    }),
    userByUsername: builder.query<ResponseType<{ userByUsername: User }>, string>({
      query: (username) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            query getUserById($username: String!) {
              userByUsername(username: $username) {
                id
                username
                email
                userProfile {
                  avatar
                  rating
                  company
                  phone
                  birthday
                  gender
                  location
                }
                role
              }
            }
          `,
          variables: { username },
        },
      }),
    }),
    updateUserProfile: builder.mutation<ResponseType<{ updateUserProfile: UserProfileType }>, { userId: number; userProfileInput: UserProfileInput }>({
      query: ({ userId, userProfileInput }) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            mutation UpdateUserProfile($userId: Int!, $userProfileInput: UserProfileInput!) {
              updateUserProfile(userId: $userId, userProfileInput: $userProfileInput) {
                id
                gender
              } 
            } 
            `,
          variables: { userId, userProfileInput },
        },
      }),
    }),
    getContracts: builder.query<ResponseType<{ contracts: Contract[] }>, void>({
      query: () => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            query {
              contracts {
                contractId
                paymentAmount
                status
                project {
                  projectName
                }
                freelancer {
                  username
                }
                client {
                  username
                }
              }
            }
          `,
        },
      }),
    }),
    updateURLFileContract: builder.mutation<ResponseType<{ updateURLFileContract: Contract }>, { freelanceId: number; projectId: number; url: string }>({
      query: ({ freelanceId, projectId, url }) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            mutation UpdateURLFileContract($freelanceId: Int!, $projectId: Int!, $url: String!) {
              updateURLFileContract(freelanceId: $freelanceId, projectId: $projectId, url: $url) {
                filePath
              } 
            } 
            `,
          variables: { freelanceId, projectId, url },
        },
      }),
    }),
    contractByProjectId: builder.mutation<ResponseType<{ contractByProjectId: Contract }>, number>({
      query: (projectId) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            mutation GetContractByProjectId($projectId: Int!) {
              contractByProjectId(projectId: $projectId) {
                contractId
                filePath
              }
            }
          `,
          variables: { projectId },
        },
      }),
    }),
    finishedProject: builder.mutation<ResponseType<{ finishedProject: boolean }>, number>({
      query: (contractId) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            mutation FinishedProject($contractId: Int!) {
              finishedProject(contractId: $contractId)
            }
          `,
          variables: { contractId },
        },
      }),
    }),
    notificationsByUser: builder.query<ResponseType<{ notificationsByUser: NotificationType[] }>, number>({
      query: (userId) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            query getNotificationsByUser($userId: Int!) {
              notificationsByUser(userId: $userId) {
                id  
                senderId
                receiverId
                message
                createdAt
                isRead
                sender {
                  username
                }
                receiver {
                  username
                }
              }
            }
          `,
          variables: { userId },
        },
      }),
    }),
    markNotificationAsRead: builder.mutation<ResponseType<{ markNotificationAsRead: boolean }>, number>({
      query: (id) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            mutation MarkNotificationAsRead($id: Int!) {
              markNotificationAsRead(id: $id)
            }
          `,
          variables: { id },
        },
      }),
    }),
    createReview: builder.mutation<ResponseType<{ createReview: ReviewType }>, { review: ReviewInput }>({
      query: ({ review }) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            mutation createReview($review: ReviewInput!) {
              createReview(review: $review) {
                reviewId
                rating
                feedback
              }
            }
          `,
          variables: { review },
        },
      }),
    }),
    checkReviewed: builder.mutation<ResponseType<{ checkReviewed: boolean }>, { projectId: number, userId: number }>({
      query: ({ projectId, userId }) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            mutation CheckReviewed($projectId: Int!, $userId: Int!) {
              checkReviewed(projectId: $projectId, userId: $userId)
            }
          `,
          variables: { projectId, userId },
        },
      }),
    }),
    getRevenue: builder.query<ResponseType<{ monthlyRevenue: Revenue[] }>, void>({
      query: () => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            query {
              monthlyRevenue {
                month
                revenue
              }
            }
          `,
        },
      }),
    }),
    getStatistics: builder.query<ResponseType<{ statistics: StatisticsType }>, void>({
      query: () => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            query {
              statistics {
                revenueStatistics {
                  today
                  thisWeek
                  thisMonth
                  thisYear
                }
                projectStatistics {
                  today
                  thisWeek
                  thisMonth
                  thisYear
                }
                freelancerStatistics {
                  today
                  thisWeek
                  thisMonth
                  thisYear
                }
                contractStatistics {
                  today
                  thisWeek
                  thisMonth
                  thisYear
                }
              }
            }
          `,
        },
      }),
    }),
    getPercentCategory: builder.query<ResponseType<{ categoryPercentages: CateogoryPercent[] }>, void>({
      query: () => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            query {
              categoryPercentages {
                categoryName
                projectCount
                percentage
              }
            }
          `,
        },
      }),
    }),
    groupedProjectStatusCounts: builder.query<ResponseType<{ groupedProjectStatusCounts: ProjectStatusCount[] }>, void>({
      query: () => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            query {
              groupedProjectStatusCounts {
                status
                projectCount
              }
            }
          `,
        },
      }),
    }),
    verifyCode: builder.mutation<ResponseType<{ verifyCode: boolean }>, { email: string, code: string }>({
      query: ({ email, code }) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            mutation verifyCode($email: String!, $code: String!) {
              verifyCode(email: $email, code: $code)
            }
          `,
          variables: { email, code },
        },
      })
    }),
    forgotPassword: builder.mutation<ResponseType<{ forgotPassword: boolean }>, string>({
      query: (email) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            mutation SendCode($email: String!) {
              forgotPassword(email: $email)
            }
          `,
          variables: { email },
        },
      })
    }),
    changePassword: builder.mutation<ResponseType<{ changePassword: boolean }>, { email: string, newPass: string }>({
      query: ({ email, newPass }) => ({
        url: 'graphql',
        method: 'POST',
        body: {
          query: `
            mutation ChangePassword($email: String!, $newPass: String!) {
              changePassword(email: $email, newPass: $newPass)
            }
          `,
          variables: { email, newPass },
        },
      })
    }),
  }),
});

export const { useCreateProjectMutation,
  useGetProjectQuery,
  useGetApplyByFreelancerQuery,
  useProjectByIdQuery,
  useProjectByClientQuery,
  useGetAppliesQuery,
  useCreateApplyMutation,
  useHasAppliedForProjectQuery,
  useAcceptApplyMutation,
  useGetWalletQuery,
  useUpdateWalletBalanceMutation,
  useGetCategoryQuery,
  useGetUsersQuery,
  useUserByIdQuery,
  useUserByUsernameQuery,
  useUpdateUserProfileMutation,
  useGetContractsQuery,
  useUpdateURLFileContractMutation,
  useContractByProjectIdMutation,
  useFinishedProjectMutation,
  useNotificationsByUserQuery,
  useMarkNotificationAsReadMutation,
  useCreateReviewMutation,
  useCheckReviewedMutation,
  useGetRevenueQuery,
  useGetStatisticsQuery,
  useGetPercentCategoryQuery,
  useGroupedProjectStatusCountsQuery,
  useForgotPasswordMutation,
  useVerifyCodeMutation,
  useChangePasswordMutation, } = graphqlApi;