import UsersPageId from '@/pages/UsersPageId'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/$userId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <UsersPageId/>
  </div>
}
