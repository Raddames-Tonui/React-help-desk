import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, SubjectData } from "@/context/types";
import { fetchSubjects } from "@/pages/subjects/FetchSubjects";

export function useSubjects(page: number, pageSize: number) {
  return useQuery<ApiResponse<SubjectData>, Error>({
    queryKey: ["subjects", page, pageSize],
    queryFn: () => fetchSubjects({ page, pageSize }),
    keepPreviousData: true,  // smooth pagination
    staleTime: 1000 * 60,    // cache 1 min
  });
}
