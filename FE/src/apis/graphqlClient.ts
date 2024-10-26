import { ApolloClient, InMemoryCache } from '@apollo/client';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem('access_token');

const graphqlClient = new ApolloClient({
  uri: `${BASE_URL}/graphql`,
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default graphqlClient;
