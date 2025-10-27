import DynamicForm from '@/components/form/DynamicForm';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_protected/dynamicforms/user-registration',
)({
  component: RouteComponent,
})


const registrationFormSchema: any = {
  id: "user-registration",
  meta: {
    title: "Create Account",
    subtitle: "Join our community today"
  },
  fields: {
    // Personal Information
    firstName: {
      id: "firstName",
      label: "First Name",
      renderer: "text",
      placeholder: "John",
      rules: { required: "First name is required" }
    },
    lastName: {
      id: "lastName",
      label: "Last Name",
      renderer: "text",
      placeholder: "Doe",
      rules: { required: "Last name is required" }
    },
    dateOfBirth: {
      id: "dateOfBirth",
      label: "Date of Birth",
      renderer: "date",
      props: {
        maxDate: new Date(),
        placeholder: "Pick a date"
      },
      rules: { required: "Date of birth is required" }
    },

    // Account Information
    email: {
      id: "email",
      label: "Email",
      renderer: "text",
      inputType: "email",
      placeholder: "you@example.com",
      rules: {
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email"
        }
      }
    },
    password: {
      id: "password",
      label: "Password",
      renderer: "text",
      inputType: "password",
      rules: {
        required: "Password is required",
        minLength: { value: 8, message: "Password must be at least 8 characters" },
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          message: "Password must contain uppercase, lowercase, and number"
        }
      }
    },
    confirmPassword: {
      id: "confirmPassword",
      label: "Confirm Password",
      renderer: "text",
      inputType: "password",
      rules: {
        required: "Please confirm your password",
        validate: (value, formValues) =>
          value === formValues.password || "Passwords don't match"
      }
    },

    // Account Type
    accountType: {
      id: "accountType",
      label: "Account Type",
      renderer: "radio",
      defaultValue: "personal",
      props: {
        options: [
          { label: "Personal", value: "personal" },
          { label: "Business", value: "business" }
        ]
      },
      rules: { required: "Please select an account type" }
    },

    // Business Fields (Conditional)
    companyName: {
      id: "companyName",
      label: "Company Name",
      renderer: "text",
      placeholder: "Acme Inc.",
      visibleWhen: {
        field: "accountType",
        op: "equals",
        value: "business"
      },
      rules: {
        required: "Company name is required for business accounts"
      }
    },
    taxId: {
      id: "taxId",
      label: "Tax ID / EIN",
      renderer: "text",
      placeholder: "XX-XXXXXXX",
      visibleWhen: {
        field: "accountType",
        op: "equals",
        value: "business"
      },
      rules: {
        pattern: {
          value: /^\d{2}-\d{7}$/,
          message: "Invalid Tax ID format (XX-XXXXXXX)"
        }
      }
    },

    // Terms
    agreeToTerms: {
      id: "agreeToTerms",
      label: "I agree to the Terms of Service and Privacy Policy",
      renderer: "checkbox",
      rules: {
        required: "You must agree to the terms"
      }
    }
  },
  layout: [
    {
      kind: "section",
      title: "Personal Information",
      withDivider: true,
      children: [
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "firstName" },
            { kind: "field", fieldId: "lastName" },
            { kind: "field", fieldId: "dateOfBirth", colSpan: 2 }
          ]
        }
      ]
    },
    {
      kind: "section",
      title: "Account Details",
      withDivider: true,
      children: [
        {
          kind: "stack",
          spacing: "md",
          children: [
            { kind: "field", fieldId: "email" },
            {
              kind: "grid",
              cols: 2,
              spacing: "md",
              children: [
                { kind: "field", fieldId: "password" },
                { kind: "field", fieldId: "confirmPassword" }
              ]
            }
          ]
        }
      ]
    },
    {
      kind: "section",
      title: "Account Type",
      withDivider: true,
      children: [
        {
          kind: "stack",
          spacing: "md",
          children: [
            { kind: "field", fieldId: "accountType" },
            { kind: "field", fieldId: "companyName" },
            { kind: "field", fieldId: "taxId" }
          ]
        }
      ]
    },
    {
      kind: "stack",
      spacing: "md",
      children: [
        { kind: "field", fieldId: "agreeToTerms" }
      ]
    }
  ]
};

function RouteComponent() {
  return <div><DynamicForm props={registrationFormSchema} /></div>
}
