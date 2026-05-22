import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // If the error has not been toasted by the Axios response interceptor, toast it here
      if (!error.globalHandled) {
        const message = error.response?.data?.message || error.message || 'A query error occurred';
        toast.error(message);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      // If the error has not been toasted by the Axios response interceptor, toast it here
      if (!error.globalHandled) {
        const message = error.response?.data?.message || error.message || 'A mutation error occurred';
        toast.error(message);
      }
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents unexpected re-fetches when switching tabs
      retry: 1, // Minimize retry delay for better UX
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <App />
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);