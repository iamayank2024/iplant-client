import {
  Query,
  QueryClient,
  type QueryObserverResult,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 404s or other client errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 2 times on other errors
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error: any) => {
        const message = error?.response?.data?.message || "An error occurred";
        toast.error(message);
      },
      onSuccess: (data: any) => {
        toast.success(data?.message || "Operation successful");
      },
    },
  },
});

// Global error handler for query errors
queryClient.setDefaultOptions({
  queries: {
    throwOnError: (
      error: any,
      query: Query<any, Error, unknown, readonly unknown[]>
    ) => {
      const message = error?.response?.data?.message || "An error occurred";
      toast.error(message);
      return false;
    },
  },
});

export default queryClient;
