import DynamicForm from '@/components/form/DynamicForm';
import { createFileRoute } from '@tanstack/react-router'
import { insuranceQuoteSchema } from "@/utils/formSchemas"

export const Route = createFileRoute(
  '/_protected/dynamicforms/multi-condition/form',
)({
  component: RouteComponent,
})


function RouteComponent() {
  return <div>
    <DynamicForm schema={insuranceQuoteSchema} />
  </div>
}
