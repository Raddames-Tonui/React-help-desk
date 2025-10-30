import DynamicForm from '@/dynamic-form/DynamicForm';
import { createFileRoute } from '@tanstack/react-router'
import { jobApplicationSchema } from "@/utils/formSchemas"

export const Route = createFileRoute(
  '/_protected/dynamicforms/job/application/form',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <DynamicForm schema={jobApplicationSchema} />
  </div>
}
