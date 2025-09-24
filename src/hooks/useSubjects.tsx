import type { ApiResponse, SubjectData } from "@/context/types";
import { fetchSubjects } from "@/pages/subjects/tanstack-query/FetchSubjects";
import { useQuery } from "@tanstack/react-query";


export function useSubjects(page: number, pageSize: number) {
    return useQuery<ApiResponse<SubjectData>, Error>({
        queryKey: ["subjects", page, pageSize],
        queryFn: () => fetchSubjects({ page, pageSize }),
        keepPreviousData: true,
    });
}