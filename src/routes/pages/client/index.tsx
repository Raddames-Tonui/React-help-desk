import { createFileRoute } from '@tanstack/react-router'
import Client from '@/pages/Client'

export const Route = createFileRoute('/pages/client/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Client />
  )
}
