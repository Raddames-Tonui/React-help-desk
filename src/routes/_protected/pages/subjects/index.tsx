import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/pages/subjects/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/pages/subjects/"!</div>
}
