import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

const HASURA_URL = process.env.REACT_APP_HASURA_URL; 

if (!HASURA_URL) {
  // temporary log to confirm it’s set
  // eslint-disable-next-line no-console
  console.error('Missing REACT_APP_HASURA_URL. Requests will fail.');
}


export function createApolloClient({ getToken }) {
  const http = new HttpLink({ uri: HASURA_URL });

  // Attach Authorization when signed in; otherwise use anonymous role
  const authLink = new ApolloLink(async (operation, forward) => {
    let token = null;
    try {
      token = getToken ? await getToken({ template: 'hasura' }) : null;
    } catch (_) {
      token = null;
    }

    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : { 'x-hasura-role': 'anonymous' }),
      },
    }));

    return forward(operation);
  });

  return new ApolloClient({
    link: authLink.concat(http),
    cache: new InMemoryCache(),
  });
}

// const httpLink = new HttpLink({
//   uri: HASURA_URL,
//   headers: {
//     'x-hasura-admin-secret': '5HMIJ3RMzyUU61rgnRbpbcMnSPC5kSYwHr8S8bGDv4tk7ZLC8A85IY6H6r3PBm9C'  // Use environment variables in production
//   }
// });

// const client = new ApolloClient({
//   link: httpLink,
//   cache: new InMemoryCache()
// });

// export default client;
