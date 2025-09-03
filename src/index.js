import React, { useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ApolloProvider } from '@apollo/client';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { createApolloClient } from './apolloClient';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
if (!clerkPubKey) throw new Error('Missing Publishable Key');

function ApolloWithAuth({ children }) {
  const { getToken } = useAuth();

  // Recreate the client only if getToken reference changes
  const client = useMemo(() => createApolloClient({ getToken }), [getToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

const root = createRoot(document.getElementById('root'));
root.render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <ApolloWithAuth>
      <App />
    </ApolloWithAuth>
  </ClerkProvider>
);
