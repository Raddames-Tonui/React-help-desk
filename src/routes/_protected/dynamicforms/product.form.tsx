import DynamicForm from '@/dynamic-form/DynamicForm';
import { createFileRoute } from '@tanstack/react-router'
import { productFormSchema } from "@/utils/formSchemas"

export const Route = createFileRoute('/_protected/dynamicforms/product/form')({
  component: RouteComponent,
})


function RouteComponent() {
  return <div>

    <DynamicForm schema={productFormSchema} />
  </div>
}
