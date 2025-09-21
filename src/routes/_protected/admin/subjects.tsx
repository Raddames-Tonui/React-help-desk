import SubjectsPage from '@/pages/SubjectsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/subjects')({
  component: SubjectsPage,
})

