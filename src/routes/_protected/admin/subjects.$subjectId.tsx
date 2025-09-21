import SubjectsPageId from '@/pages/SubjectsPageId'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/subjects/$subjectId')({
  component: SubjectsPageId,
})

