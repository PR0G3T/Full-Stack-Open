import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import Main from './components/Main';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Main />
      <StatusBar style="auto" />
    </ApolloProvider>
  );
}
