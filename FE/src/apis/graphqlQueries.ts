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
