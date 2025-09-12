import { createFileRoute } from '@tanstack/react-router'
import Vendor2 from '../../../pages/Vendor2'

export const Route = createFileRoute('/pages/vendor/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Vendor2/>
}
