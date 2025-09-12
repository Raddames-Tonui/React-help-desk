import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pages/client/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/pages/client/tsx/"!</div>
}
