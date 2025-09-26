import UsersPageId from '@/pages/users/UsersPageId'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/users/$userId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <UsersPageId />
  </div>
}
