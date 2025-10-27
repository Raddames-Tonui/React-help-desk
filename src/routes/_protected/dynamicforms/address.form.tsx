import DynamicForm from '@/components/form/DynamicForm';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dynamicforms/address/form')({
  component: RouteComponent,
})

const addressFormSchema: any = {
  id: "address-form",
  meta: {
    title: "Shipping Address",
    subtitle: "Where should we send your order?"
  },
  fields: {
    fullName: {
      id: "fullName",
      label: "Full Name",
      renderer: "text",
      rules: { required: "Full name is required" }
    },
    country: {
      id: "country",
      label: "Country",
      renderer: "select",
      props: {
        data: [
          { label: "Kenya", value: "KE" },
          { label: "United States", value: "US" },
          { label: "United Kingdom", value: "UK" },
          { label: "Canada", value: "CA" }
        ],
        searchable: true
      },
      rules: { required: "Country is required" }
    },

    // Kenya-specific
    county: {
      id: "county",
      label: "County",
      renderer: "select",
      visibleWhen: {
        field: "country",
        op: "equals",
        value: "KE"
      },
      props: {
        data: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
        searchable: true
      },
      rules: { required: "County is required" }
    },

    // US-specific
    state: {
      id: "state",
      label: "State",
      renderer: "select",
      visibleWhen: {
        field: "country",
        op: "equals",
        value: "US"
      },
      props: {
        data: ["California", "Texas", "New York", "Florida", "Illinois"],
        searchable: true
      },
      rules: { required: "State is required" }
    },

    // UK-specific
    postcode: {
      id: "postcode",
      label: "Postcode",
      renderer: "text",
      visibleWhen: {
        field: "country",
        op: "equals",
        value: "UK"
      },
      rules: {
        required: "Postcode is required",
        pattern: {
          value: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
          message: "Invalid UK postcode"
        }
      }
    },

    // Common fields
    addressLine1: {
      id: "addressLine1",
      label: "Address Line 1",
      renderer: "text",
      placeholder: "Street address",
      rules: { required: "Address is required" }
    },
    addressLine2: {
      id: "addressLine2",
      label: "Address Line 2",
      renderer: "text",
      placeholder: "Apartment, suite, etc. (optional)"
    },
    city: {
      id: "city",
      label: "City",
      renderer: "text",
      rules: { required: "City is required" }
    },
    zipCode: {
      id: "zipCode",
      label: "ZIP / Postal Code",
      renderer: "text",
      visibleWhen: {
        field: "country",
        op: "in",
        value: ["US", "CA"]
      },
      rules: { required: "ZIP code is required" }
    },
    phone: {
      id: "phone",
      label: "Phone Number",
      renderer: "text",
      inputType: "tel",
      rules: { required: "Phone number is required" }
    },
    deliveryInstructions: {
      id: "deliveryInstructions",
      label: "Delivery Instructions",
      renderer: "textarea",
      placeholder: "Any special delivery instructions?",
      props: {
        minRows: 2
      }
    },
    setAsDefault: {
      id: "setAsDefault",
      label: "Set as default shipping address",
      renderer: "checkbox",
      defaultValue: false
    }
  },
  layout: [
    {
      kind: "stack",
      spacing: "lg",
      children: [
        { kind: "field", fieldId: "fullName" },
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "country" },
            { kind: "field", fieldId: "county" },
            { kind: "field", fieldId: "state" },
            { kind: "field", fieldId: "postcode" }
          ]
        },
        { kind: "field", fieldId: "addressLine1" },
        { kind: "field", fieldId: "addressLine2" },
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "city" },
            { kind: "field", fieldId: "zipCode" }
          ]
        },
        { kind: "field", fieldId: "phone" },
        { kind: "field", fieldId: "deliveryInstructions" },
        { kind: "field", fieldId: "setAsDefault" }
      ]
    }
  ]
};

function RouteComponent() {
  return <div>
    <DynamicForm props={addressFormSchema} />
  </div>
}
