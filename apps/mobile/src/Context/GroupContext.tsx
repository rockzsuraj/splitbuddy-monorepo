import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ⚠️ IMPORTANT: create queryClient OUTSIDE the component
const queryClient = new QueryClient();

export default function GroupProvider({children}) {
  return (
    <QueryClientProvider client={queryClient}>
             {children}
    </QueryClientProvider>
  );
}