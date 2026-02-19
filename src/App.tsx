import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './components/ui/ErrorBoundary';


import AppRouter from './router/AppRouter';
import { Toaster } from 'sonner';
import { AuthProvider } from './auth/AuthProvider'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-center" richColors closeButton />
       <ErrorBoundary 
          FallbackComponent={ErrorFallback}
          onReset={() => {
            window.location.href = "/";
          }}
        >
          <AppRouter />
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
