import React from 'react';
import { Routes } from 'routes';
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Routes />
  </QueryClientProvider>
);

export default App;
