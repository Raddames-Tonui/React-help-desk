import DynamicForm from "@/components/form/DynamicForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/dynamicforms/contactform")({
    component: RouteComponent,
});

const contactFormSchema: any = {
    id: "contact-form",
    meta: {
        title: "Contact Us",
        subtitle: "We'd love to hear from you"
    },
    fields: {
        name: {
            id: "name",
            label: "Full Name",
            renderer: "text",
            placeholder: "Enter your full name",
            rules: {
                required: "Name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" }
            }
        },
        email: {
            id: "email",
            label: "Email Address",
            renderer: "text",
            inputType: "email",
            placeholder: "you@example.com",
            rules: {
                required: "Email is required",
                pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                }
            }
        },
        subject: {
            id: "subject",
            label: "Subject",
            renderer: "select",
            placeholder: "Select a subject",
            props: {
                data: [
                    { label: "General Inquiry", value: "general" },
                    { label: "Technical Support", value: "support" },
                    { label: "Sales", value: "sales" },
                    { label: "Partnership", value: "partnership" }
                ]
            },
            rules: {
                required: "Please select a subject"
            }
        },
        message: {
            id: "message",
            label: "Message",
            renderer: "textarea",
            placeholder: "Tell us what's on your mind...",
            props: {
                minRows: 4,
                maxRows: 8
            },
            rules: {
                required: "Message is required",
                minLength: { value: 10, message: "Message must be at least 10 characters" },
                maxLength: { value: 500, message: "Message cannot exceed 500 characters" }
            }
        },
        newsletter: {
            id: "newsletter",
            label: "Subscribe to newsletter",
            renderer: "checkbox",
            defaultValue: false
        }
    },
    layout: [
        {
            kind: "stack",
            spacing: "md",
            children: [
                { kind: "field", fieldId: "name" },
                { kind: "field", fieldId: "email" },
                { kind: "field", fieldId: "subject" },
                { kind: "field", fieldId: "message" },
                { kind: "field", fieldId: "newsletter" }
            ]
        }
    ]
};

function RouteComponent() {
    return (
        <div style={{ padding: "2rem" }}>
            <DynamicForm schema={contactFormSchema} />
        </div>
    );
}
