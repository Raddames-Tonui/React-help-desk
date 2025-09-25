import { TOKEN } from "@/utils/Constants";
import { keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";

export function useTasks(subectId: number, page: number, pageSize: number) {
    const queryClient = useQueryClient();

    const tasksQuery = useuery({
        queryKey: ["tasks", SubjectPageId, page, pageSize],
        queryFn: async () => {
            const res = await fetch(`/api/admin/tasks/?subject_id=${subjectId}&page=${page}&page_size=${pageSize}`, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`
                }
            });
            if (!res.ok) throw new Error("Failed to fetch task");
            return res.json();
        },
        keepPreviousData: true,
        staleTime: 1000 * 60,
    });

    const createTaskMutation = useMutation({
        mutationFn: asyn(payload: TaskPayload) => {
        const res =  await fetch(`/api/admin/tasks`)
        }
    })
}