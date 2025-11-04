import TanstackFom from '@/pages/TanstackFom'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tanstack/react-form')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><TanstackFom /> </div>
}
