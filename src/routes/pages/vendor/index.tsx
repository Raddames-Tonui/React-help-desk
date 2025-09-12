import { createFileRoute } from '@tanstack/react-router'
import Vendor from '../../../pages/Vendor'

export const Route = createFileRoute('/pages/vendor/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Vendor/>
}
