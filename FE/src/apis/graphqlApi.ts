import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ProjectResponseType } from '../types/ProjectType';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const graphqlApi = createApi({
    reducerPath: 'graphqlApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/graphql`,
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('access_token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        createProject: builder.mutation<ProjectResponseType, { project: any }>({
            query: ({ project }) => ({
                url: '',
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
    }),
});

export const { useCreateProjectMutation } = graphqlApi;