import TasksPage from '@/pages/Tasks/TasksPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/tasks/')({
  component: TasksPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: Number(search.page) || 1,
      pageSize: Number(search.pageSize) || 10, 
      sortBy: (search.sortBy as string) ?? '',
    }
  }
})
