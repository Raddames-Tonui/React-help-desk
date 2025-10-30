import DynamicForm from '@/dynamic-form/DynamicForm';
import { createFileRoute } from '@tanstack/react-router'
import { agentUpdateSchema } from "@/utils/formSchemas"


export const Route = createFileRoute('/_protected/dynamicforms/agent/update')({
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
