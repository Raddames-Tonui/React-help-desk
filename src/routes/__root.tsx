import { createRootRoute, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthProvider } from '@/context/AuthContext'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from '@/context/ThemeProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import "@/css/authPages.css";

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
            <Outlet />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
    {/*<TanStackRouterDevtools />*/}
  </AuthProvider>
)

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <div className="auth-page">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="auth-svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9
             4.03-9 9-9 9 4.03 9 9z"
      />
    </svg>
    <h1 className="auth-title">404: Page Not Found</h1>
    <p className="auth-message">
      Looks like this page ran away... 🏃💨 <br />
      Or maybe it never existed 🤔
    </p>
  </div>
})
