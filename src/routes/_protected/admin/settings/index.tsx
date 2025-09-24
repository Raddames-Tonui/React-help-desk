import SubjectsPage from '@/pages/subjects/tanstack-query/SubjectsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <SubjectsPage/>
  </div>
}
