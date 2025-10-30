import DynamicForm from '@/dynamic-form/DynamicForm'
import { productFormSchema } from '@/dynamic-form/utils/formSchemas'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dynamicforms/product/form')({
    component: RouteComponent,
})

function RouteComponent() {
    const handleFormSubmit = (values: Record<string, any>) => {

        console.log("Data for submission", values)
    }

    return <div>
        <DynamicForm
            schema={productFormSchema}
            onSubmit={handleFormSubmit}
        />
    </div>
}