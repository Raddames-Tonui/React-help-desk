import DynamicForms from '@/pages/dynamic-forms/DynamicForms'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dynamicforms/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>
        <DynamicForms/>
    </div>
}
