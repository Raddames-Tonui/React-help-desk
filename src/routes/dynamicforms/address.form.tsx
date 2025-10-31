import DynamicForm from '@/dynamic-form/DynamicForm'
import { addressFormSchema } from '@/dynamic-form/utils/formSchemas'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dynamicforms/address/form')({
  component: RouteComponent,
})

function RouteComponent() {
  const handleFormSubmit = (values: Record<string, any>) => {

    console.log("Data for submission", values)
  }

  return <div className='page-wrapper'>
    <DynamicForm
      schema={ addressFormSchema}
      onSubmit={handleFormSubmit}
    />
  </div>
}