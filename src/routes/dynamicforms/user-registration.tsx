import DynamicForm from '@/dynamic-form/DynamicForm'
import { registrationFormSchema } from '@/dynamic-form/utils/formSchemas'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dynamicforms/user-registration')({
  component: RouteComponent,
})

function RouteComponent() {
  const handleFormSubmit = (values: Record<string, any>) => {

    console.log("Data for submission", values)
  }

  return <div>
    <DynamicForm
      schema={registrationFormSchema}
      onSubmit={handleFormSubmit}
    />
  </div>
}