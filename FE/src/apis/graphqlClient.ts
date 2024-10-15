import { ApolloClient, InMemoryCache } from '@apollo/client';

const BASE_URL = import.meta.env.BASE_URL;

const graphqlClient = new ApolloClient({
  uri: `${BASE_URL}/graphql`,
  cache: new InMemoryCache(),
});

export default graphqlClient;
