import { QueryClient } from "@tanstack/react-query";

// Create a single shared instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,          // retry once on failure
      refetchOnWindowFocus: false, // don't refetch when window refocuses
    },
  },
});
