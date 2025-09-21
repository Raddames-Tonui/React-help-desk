import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/subjects/$subjectId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/admin/subjects/$subjectId"!</div>
}
