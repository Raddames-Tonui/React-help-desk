import DynamicForm from '@/dynamic-form/DynamicForm'
import { agentUpdateSchema } from '@/dynamic-form/utils/formSchemas'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dynamicforms/agent/update')({
  component: RouteComponent,
})

function RouteComponent() {
  const handleFormSubmit = (values: Record<string, any>) => {

    console.log("Data for submission", values)
  }

  return <div>
    <DynamicForm schema={agentUpdateSchema}
      onSubmit={handleFormSubmit}
    />
  </div>
}