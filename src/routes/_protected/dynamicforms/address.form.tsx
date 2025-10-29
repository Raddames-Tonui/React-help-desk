import DynamicForm from '@/components/form/DynamicForm';
import { createFileRoute } from '@tanstack/react-router'
import { addressFormSchema } from "@/utils/formSchemas.ts"

export const Route = createFileRoute('/_protected/dynamicforms/address/form')({
  component: RouteComponent,
})


function RouteComponent() {
  const handleFormSubmit = (values: Record<string, any>) => {

    console.log("Data for submission", values)
  }

  return <div>
    <DynamicForm
      schema={addressFormSchema}
      onSubmit={handleFormSubmit}
    />
  </div>
}
