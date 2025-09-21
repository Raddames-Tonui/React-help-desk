import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/vendor/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/vendor/"!</div>
}
