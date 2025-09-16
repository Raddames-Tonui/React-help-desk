import { createFileRoute } from '@tanstack/react-router'
import Odata from '@/pages/Odata'

export const Route = createFileRoute('/_protected/pages/odata/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Odata />
    )
}
