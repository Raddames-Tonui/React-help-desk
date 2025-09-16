import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/pages/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/pages/"!</div>
}
