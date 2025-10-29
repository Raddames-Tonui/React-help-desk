import DynamicForm from '@/components/form/DynamicForm';
import { createFileRoute } from '@tanstack/react-router'
import {registrationFormSchema } from "@/utils/formSchemas"

export const Route = createFileRoute(
  '/_protected/dynamicforms/user-registration',
)({
  component: RouteComponent,
})


function RouteComponent() {
  return <div><DynamicForm schema={registrationFormSchema} /></div>
}
