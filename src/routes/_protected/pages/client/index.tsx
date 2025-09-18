import { createFileRoute } from '@tanstack/react-router'
import Client from '@/pages/Client'

export const Route = createFileRoute('/_protected/pages/client/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Client />
  )
}
