import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'https://internal-cattle-16.hasura.app/v1/graphql',
  headers: {
    'x-hasura-admin-secret': '5HMIJ3RMzyUU61rgnRbpbcMnSPC5kSYwHr8S8bGDv4tk7ZLC8A85IY6H6r3PBm9C'  // Use environment variables in production
  }
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

export default client;
