import DynamicForm from '@/components/form/DynamicForm';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_protected/dynamicforms/multi-condition/form',
)({
  component: RouteComponent,
})
const insuranceQuoteSchema: any = {
  id: "insurance-quote",
  meta: {
    title: "Get Insurance Quote",
    subtitle: "Fill in your details for a personalized quote"
  },
  fields: {
    insuranceType: {
      id: "insuranceType",
      label: "Insurance Type",
      renderer: "select",
      props: {
        data: [
          { label: "Auto Insurance", value: "auto" },
          { label: "Home Insurance", value: "home" },
          { label: "Life Insurance", value: "life" },
          { label: "Health Insurance", value: "health" }
        ]
      },
      rules: { required: "Required" }
    },

    // Auto Insurance Fields
    vehicleType: {
      id: "vehicleType",
      label: "Vehicle Type",
      renderer: "select",
      visibleWhen: {
        field: "insuranceType",
        op: "equals",
        value: "auto"
      },
      props: {
        data: ["Car", "Motorcycle", "Truck", "SUV"]
      },
      rules: { required: "Required" }
    },
    vehicleAge: {
      id: "vehicleAge",
      label: "Vehicle Age (years)",
      renderer: "number",
      visibleWhen: {
        field: "insuranceType",
        op: "equals",
        value: "auto"
      },
      props: { min: 0, max: 50 }
    },
    hasAccidents: {
      id: "hasAccidents",
      label: "Any accidents in last 3 years?",
      renderer: "radio",
      visibleWhen: {
        field: "insuranceType",
        op: "equals",
        value: "auto"
      },
      props: {
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" }
        ]
      }
    },
    accidentCount: {
      id: "accidentCount",
      label: "Number of Accidents",
      renderer: "number",
      visibleWhen: [
        {
          field: "insuranceType",
          op: "equals",
          value: "auto"
        },
        {
          field: "hasAccidents",
          op: "equals",
          value: "yes"
        }
      ],
      props: { min: 1, max: 10 },
      rules: { required: "Required" }
    },

    // Home Insurance Fields
    propertyType: {
      id: "propertyType",
      label: "Property Type",
      renderer: "select",
      visibleWhen: {
        field: "insuranceType",
        op: "equals",
        value: "home"
      },
      props: {
        data: ["House", "Apartment", "Condo", "Townhouse"]
      },
      rules: { required: "Required" }
    },
    propertyValue: {
      id: "propertyValue",
      label: "Property Value (KES)",
      renderer: "number",
      visibleWhen: {
        field: "insuranceType",
        op: "equals",
        value: "home"
      },
      props: {
        min: 0,
        step: 100000,
        thousandsSeparator: ","
      },
      rules: { required: "Required" }
    },
    hasSecuritySystem: {
      id: "hasSecuritySystem",
      label: "Has Security System",
      renderer: "switch",
      visibleWhen: {
        field: "insuranceType",
        op: "equals",
        value: "home"
      },
      defaultValue: false
    },

    // Life Insurance Fields
    age: {
      id: "age",
      label: "Age",
      renderer: "number",
      visibleWhen: {
        field: "insuranceType",
        op: "equals",
        value: "life"
      },
      props: { min: 18, max: 80 },
      rules: {
        required: "Required",
        min: { value: 18, message: "Must be 18 or older" },
        max: { value: 80, message: "Maximum age is 80" }
      }
    },
    smoker: {
      id: "smoker",
      label: "Do you smoke?",
      renderer: "radio",
      visibleWhen: {
        field: "insuranceType",
        op: "equals",
        value: "life"
      },
      props: {
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" }
        ]
      },
      rules: { required: "Required" }
    },
    coverageAmount: {
      id: "coverageAmount",
      label: "Coverage Amount (KES)",
      renderer: "select",
      visibleWhen: {
        field: "insuranceType",
        op: "equals",
        value: "life"
      },
      props: {
        data: [
          { label: "1,000,000", value: 1000000 },
          { label: "2,000,000", value: 2000000 },
          { label: "5,000,000", value: 5000000 },
          { label: "10,000,000", value: 10000000 }
        ]
      },
      rules: { required: "Required" }
    },

    // Health Insurance Fields
    familySize: {
      id: "familySize",
      label: "Number of People to Cover",
      renderer: "number",
      visibleWhen: {
        field: "insuranceType",
        op: "equals",
        value: "health"
      },
      props: { min: 1, max: 10 },
      rules: { required: "Required" }
    },
    preExistingConditions: {
      id: "preExistingConditions",
      label: "Any pre-existing conditions?",
      renderer: "radio",
      visibleWhen: {
        field: "insuranceType",
        op: "equals",
        value: "health"
      },
      props: {
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" }
        ]
      },
      rules: { required: "Required" }
    },
    conditionDetails: {
      id: "conditionDetails",
      label: "Please specify conditions",
      renderer: "textarea",
      visibleWhen: [
        {
          field: "insuranceType",
          op: "equals",
          value: "health"
        },
        {
          field: "preExistingConditions",
          op: "equals",
          value: "yes"
        }
      ],
      props: { minRows: 3 },
      rules: { required: "Required" }
    },

    // Common Fields
    fullName: {
      id: "fullName",
      label: "Full Name",
      renderer: "text",
      rules: { required: "Required" }
    },
    email: {
      id: "email",
      label: "Email",
      renderer: "text",
      inputType: "email",
      rules: {
        required: "Required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email"
        }
      }
    },
    phone: {
      id: "phone",
      label: "Phone",
      renderer: "text",
      inputType: "tel",
      rules: { required: "Required" }
    }
  },
  layout: [
    {
      kind: "section",
      title: "Insurance Type",
      withDivider: true,
      children: [
        { kind: "field", fieldId: "insuranceType" }
      ]
    },
    {
      kind: "section",
      title: "Details",
      withDivider: true,
      children: [
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            // Auto fields
            { kind: "field", fieldId: "vehicleType" },
            { kind: "field", fieldId: "vehicleAge" },
            { kind: "field", fieldId: "hasAccidents", colSpan: 2 },
            { kind: "field", fieldId: "accidentCount" },

            // Home fields
            { kind: "field", fieldId: "propertyType" },
            { kind: "field", fieldId: "propertyValue" },
            { kind: "field", fieldId: "hasSecuritySystem", colSpan: 2 },

            // Life fields
            { kind: "field", fieldId: "age" },
            { kind: "field", fieldId: "smoker" },
            { kind: "field", fieldId: "coverageAmount", colSpan: 2 },

            // Health fields
            { kind: "field", fieldId: "familySize" },
            { kind: "field", fieldId: "preExistingConditions" },
            { kind: "field", fieldId: "conditionDetails", colSpan: 2 }
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
          cols: 3,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "fullName" },
            { kind: "field", fieldId: "email" },
            { kind: "field", fieldId: "phone" }
          ]
        }
      ]
    }
  ]
};
function RouteComponent() {
  return <div>
    <DynamicForm props={insuranceQuoteSchema} />
  </div>
}
