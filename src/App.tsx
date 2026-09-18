import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AppShell } from '@/components/layout/AppShell';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
      retry: 2, 
      staleTime: 10_000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-right" />
      <AppShell />
    </QueryClientProvider>
  );
}

