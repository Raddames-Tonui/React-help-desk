import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/admin/settings/"!</div>
}
