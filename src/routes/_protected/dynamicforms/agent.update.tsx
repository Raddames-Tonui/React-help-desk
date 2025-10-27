import DynamicForm from '@/components/form/DynamicForm';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dynamicforms/agent/update')({
  component: RouteComponent,
})

const agentUpdateSchema: any = {
  id: "agent-update",
  meta: {
    title: "Update Agent",
    subtitle: "Core attributes"
  },
  fields: {
    agent_name: {
      id: "agent_name",
      label: "Agent Name",
      renderer: "text",
      placeholder: "Enter agent name",
      rules: {
        required: "Agent name is required",
        minLength: { value: 3, message: "Name must be at least 3 characters" }
      }
    },
    agent_type: {
      id: "agent_type",
      label: "Agent Type",
      renderer: "select",
      placeholder: "Select type",
      props: {
        data: [
          { label: "Individual", value: "Individual" },
          { label: "Business", value: "Business" }
        ]
      },
      rules: {
        required: "Agent type is required"
      }
    },
    id_number: {
      id: "id_number",
      label: "ID Number",
      renderer: "text",
      placeholder: "Enter ID number",
      visibleWhen: {
        field: "agent_type",
        op: "equals",
        value: "Individual"
      },
      rules: {
        required: "ID number is required for individuals",
        pattern: {
          value: /^\d{7,8}$/,
          message: "Invalid ID number format"
        }
      }
    },
    kra_pin: {
      id: "kra_pin",
      label: "KRA PIN",
      renderer: "text",
      placeholder: "AXXXXXXXXXX",
      visibleWhen: {
        field: "agent_type",
        op: "equals",
        value: "Business"
      },
      rules: {
        required: "KRA PIN is required for businesses",
        pattern: {
          value: /^[A-Z0-9]{11}$/,
          message: "Invalid KRA PIN format"
        }
      }
    },
    phone_number: {
      id: "phone_number",
      label: "Phone Number",
      renderer: "text",
      inputType: "tel",
      placeholder: "254712345678",
      rules: {
        required: "Phone number is required",
        pattern: {
          value: /^254[17]\d{8}$/,
          message: "Invalid phone number (254XXXXXXXXX)"
        }
      }
    },
    email: {
      id: "email",
      label: "Email Address",
      renderer: "text",
      inputType: "email",
      placeholder: "agent@example.com",
      rules: {
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address"
        }
      }
    },
    location: {
      id: "location",
      label: "Location",
      renderer: "text",
      placeholder: "Enter location"
    },
    remarks: {
      id: "remarks",
      label: "Remarks",
      renderer: "textarea",
      placeholder: "Additional notes...",
      props: {
        minRows: 3,
        maxRows: 6
      }
    }
  },
  layout: [
    {
      kind: "section",
      title: "Profile Information",
      withDivider: true,
      children: [
        {
          kind: "grid",
          cols: 3,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "agent_name" },
            { kind: "field", fieldId: "agent_type" },
            { kind: "field", fieldId: "id_number" },
            { kind: "field", fieldId: "kra_pin" }
          ]
        }
      ]
    },
    {
      kind: "section",
      title: "Contact Information",
      withDivider: true,
      children: [
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "phone_number" },
            { kind: "field", fieldId: "email" },
            { kind: "field", fieldId: "location", colSpan: 2 }
          ]
        }
      ]
    },
    {
      kind: "stack",
      spacing: "md",
      children: [
        { kind: "field", fieldId: "remarks" }
      ]
    }
  ]
};


function RouteComponent() {
  return <div>
    <DynamicForm schema={agentUpdateSchema} />
  </div>
}
