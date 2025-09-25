import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import type { ApiResponse, SubjectData } from "@/context/types";
import { fetchSubjects } from "@/pages/subjects/FetchSubjects";

export function useSubjects(page: number, pageSize: number) {
  const queryOptions: UseQueryOptions<ApiResponse<SubjectData>, Error> = {
    queryKey: ["subjects", page, pageSize],
    queryFn: () => fetchSubjects({ page, pageSize }),
    staleTime: 1000 * 60,
    keepPreviousData: true,
  };

  return useQuery(queryOptions);
}
