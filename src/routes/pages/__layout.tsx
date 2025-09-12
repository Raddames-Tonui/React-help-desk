import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pages/__layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/pages/__layout"!</div>
}
