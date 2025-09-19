import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthProvider } from '@/context/AuthContext'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ODataProvider } from '@/context/ODataContext';
import { UsersProvider } from '@/context/usersContext';
import {SubjectProvider} from "@/context/SubjectsContext.tsx";

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
          <SubjectProvider>
        <ODataProvider>
          <Outlet />
        </ODataProvider>
          </SubjectProvider>
      </UsersProvider>
    </QueryClientProvider>
    <TanStackRouterDevtools />
  </AuthProvider>
)

export const Route = createRootRoute({ component: RootLayout })
