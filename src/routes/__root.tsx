import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthProvider } from '@/context/AuthContext'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ODataProvider } from '@/context/ODataContext';
import { UsersProvider } from '@/context/usersContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const RootLayout = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <UsersProvider>
        <ODataProvider>
          <Outlet />
        </ODataProvider>
      </UsersProvider>
    </QueryClientProvider>
    <TanStackRouterDevtools />
  </AuthProvider>
)

export const Route = createRootRoute({ component: RootLayout })
