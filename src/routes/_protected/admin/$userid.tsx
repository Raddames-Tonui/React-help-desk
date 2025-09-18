import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/$userid')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/admin/$userid"!</div>
}
