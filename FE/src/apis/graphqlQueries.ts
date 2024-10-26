import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      email
    }
  }
`;

export const CREATE_CONTRACT = gql`
  mutation CreateContract($input: CreateContractInput!) {
    createContract(input: $input) {
      contractId
      status
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      projectId
      projectName
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation ($project: ProjectInput!, $imageFile: Upload) {
    createProject(project: $project, imageFile: $imageFile) {
      projectName
      description
      projectId
    }
  }
`;