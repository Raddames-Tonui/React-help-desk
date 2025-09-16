import { createFileRoute } from '@tanstack/react-router'
import Odata from '@/pages/odata/Odata'

export const Route = createFileRoute('/_protected/pages/odata/')({
  component: RouteComponent,
  validateSearch: (search: { page?: number;  pageSize?: number}) => search,
})

function RouteComponent() {
  return (
    <Odata/>
    )
}
