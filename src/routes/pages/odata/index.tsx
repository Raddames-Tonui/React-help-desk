import { createFileRoute } from '@tanstack/react-router'
import Odata from '@/pages/Odata'

export const Route = createFileRoute('/pages/odata/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Odata />
    )
}
