import UsersPage from '@/pages/UsersPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/users')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <UsersPage />
  </div>
}
