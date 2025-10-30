import DynamicForm from '@/dynamic-form/DynamicForm'
import { insuranceQuoteSchema } from '@/dynamic-form/utils/formSchemas'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dynamicforms/multi-condition/form')({
  component: RouteComponent,
})

function RouteComponent() {
  const handleFormSubmit = (values: Record<string, any>) => {

    console.log("Data for submission", values)
  }

  return <div>
    <DynamicForm
      schema={insuranceQuoteSchema}
      onSubmit={handleFormSubmit}
    />
  </div>
}