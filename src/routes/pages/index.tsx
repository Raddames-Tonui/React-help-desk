import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pages/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/pages/"!</div>
}
