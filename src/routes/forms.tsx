import Forms from '@/pages/Forms'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/forms')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><Forms /></div>
}
