import TasksPage from '@/pages/TasksPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/tasks/')({
  component: TasksPage,
})
