import { createRootRoute, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthProvider } from '@/context/AuthContext'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UsersProvider } from '@/context/usersContext';
import { SubjectProvider } from "@/context/SubjectsContext.tsx";
import { TasksProvider } from '@/context/TasksContext';
import { ThemeProvider } from '@/context/ThemeProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

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
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <UsersProvider>
          <SubjectProvider>
            <TasksProvider>
              <Outlet />
            </TasksProvider>
          </SubjectProvider>
        </UsersProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
    {/*<TanStackRouterDevtools />*/}
  </AuthProvider>
)

export const Route = createRootRoute({ component: RootLayout })
