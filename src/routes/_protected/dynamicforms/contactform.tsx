import DynamicForm from '@/dynamic-form/DynamicForm';
import { createFileRoute } from "@tanstack/react-router";
import { contactFormSchema } from "@/utils/formSchemas"

export const Route = createFileRoute("/_protected/dynamicforms/contactform")({
    component: RouteComponent,
});


function RouteComponent() {
    return (
        <div style={{ padding: "2rem" }}>
            <DynamicForm schema={contactFormSchema} />
        </div>
    );
}
