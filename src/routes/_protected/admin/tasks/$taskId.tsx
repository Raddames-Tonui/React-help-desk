import TaskPageId from '@/pages/TaskPageId'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/tasks/$taskId')({
  component: TaskPageId,
})

