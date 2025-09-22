import { createRootRoute, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthProvider } from '@/context/AuthContext'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ODataProvider } from '@/context/ODataContext';
import { UsersProvider } from '@/context/usersContext';
import { SubjectProvider } from "@/context/SubjectsContext.tsx";
import { TasksProvider } from '@/context/TasksContext';
import { ThemeProvider } from '@/context/ThemeProvider';

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
              <ODataProvider>
                <Outlet />
              </ODataProvider>
            </TasksProvider>
          </SubjectProvider>
        </UsersProvider>
      </QueryClientProvider>
    </ThemeProvider>
    {/*<TanStackRouterDevtools />*/}
  </AuthProvider>
)

export const Route = createRootRoute({ component: RootLayout })
