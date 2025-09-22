import { createFileRoute } from '@tanstack/react-router'
import Vendor from '@/pages/vendor/Vendor'

export const Route = createFileRoute('/_protected/pages/vendor/dummy')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <Vendor />
  </div>
}
