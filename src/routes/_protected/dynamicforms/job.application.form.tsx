import DynamicForm from '@/components/form/DynamicForm';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_protected/dynamicforms/job/application/form',
)({
  component: RouteComponent,
})

const jobApplicationSchema: any = {
  id: "job-application",
  meta: {
    title: "Job Application",
    subtitle: "Software Engineer Position"
  },
  fields: {
    // Personal
    firstName: {
      id: "firstName",
      label: "First Name",
      renderer: "text",
      rules: { required: "Required" }
    },
    lastName: {
      id: "lastName",
      label: "Last Name",
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
    },

    // Experience
    experienceLevel: {
      id: "experienceLevel",
      label: "Experience Level",
      renderer: "select",
      props: {
        data: [
          { label: "Entry Level (0-2 years)", value: "entry" },
          { label: "Mid Level (3-5 years)", value: "mid" },
          { label: "Senior (6-10 years)", value: "senior" },
          { label: "Lead (10+ years)", value: "lead" }
        ]
      },
      rules: { required: "Required" }
    },
    yearsOfExperience: {
      id: "yearsOfExperience",
      label: "Years of Experience",
      renderer: "number",
      props: { min: 0, max: 50 },
      rules: {
        required: "Required",
        min: { value: 0, message: "Cannot be negative" }
      }
    },
    currentlyEmployed: {
      id: "currentlyEmployed",
      label: "Currently Employed",
      renderer: "radio",
      props: {
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" }
        ]
      },
      rules: { required: "Required" }
    },
    currentCompany: {
      id: "currentCompany",
      label: "Current Company",
      renderer: "text",
      visibleWhen: {
        field: "currentlyEmployed",
        op: "equals",
        value: "yes"
      },
      rules: { required: "Required" }
    },
    currentPosition: {
      id: "currentPosition",
      label: "Current Position",
      renderer: "text",
      visibleWhen: {
        field: "currentlyEmployed",
        op: "equals",
        value: "yes"
      }
    },
    noticePeriod: {
      id: "noticePeriod",
      label: "Notice Period",
      renderer: "select",
      visibleWhen: {
        field: "currentlyEmployed",
        op: "equals",
        value: "yes"
      },
      props: {
        data: [
          { label: "Immediate", value: "immediate" },
          { label: "2 weeks", value: "2weeks" },
          { label: "1 month", value: "1month" },
          { label: "2 months", value: "2months" },
          { label: "3 months", value: "3months" }
        ]
      }
    },

    // Skills
    primarySkills: {
      id: "primarySkills",
      label: "Primary Skills",
      renderer: "multiselect",
      props: {
        data: [
          "JavaScript", "TypeScript", "React", "Node.js",
          "Python", "Java", "Go", "Rust", "C++",
          "SQL", "MongoDB", "PostgreSQL", "Redis",
          "AWS", "Azure", "Docker", "Kubernetes"
        ],
        searchable: true,
        maxValues: 8
      },
      rules: {
        required: "Select at least 3 skills",
        validate: (value) =>
          (value && value.length >= 3) || "Select at least 3 skills"
      }
    },

    // Documents
    resume: {
      id: "resume",
      label: "Resume/CV",
      renderer: "file",
      props: {
        accept: ".pdf,.doc,.docx",
        maxSize: 5 * 1024 * 1024 // 5MB
      },
      rules: { required: "Resume is required" }
    },
    coverLetter: {
      id: "coverLetter",
      label: "Cover Letter",
      renderer: "textarea",
      placeholder: "Tell us why you're a great fit...",
      props: {
        minRows: 6
      },
      rules: {
        required: "Cover letter is required",
        minLength: { value: 100, message: "At least 100 characters" }
      }
    },
    portfolio: {
      id: "portfolio",
      label: "Portfolio URL",
      renderer: "text",
      inputType: "url",
      placeholder: "https://yourportfolio.com",
      rules: {
        pattern: {
          value: /^https?:\/\/.+/,
          message: "Must be a valid URL"
        }
      }
    },
    linkedIn: {
      id: "linkedIn",
      label: "LinkedIn Profile",
      renderer: "text",
      inputType: "url",
      placeholder: "https://linkedin.com/in/yourprofile"
    },
    github: {
      id: "github",
      label: "GitHub Profile",
      renderer: "text",
      inputType: "url",
      placeholder: "https://github.com/yourusername"
    },

    // Preferences
    expectedSalary: {
      id: "expectedSalary",
      label: "Expected Salary (Annual, KES)",
      renderer: "number",
      props: {
        min: 0,
        step: 100000,
        thousandsSeparator: ","
      }
    },
    willingToRelocate: {
      id: "willingToRelocate",
      label: "Willing to Relocate",
      renderer: "switch",
      defaultValue: false
    },
    remoteWork: {
      id: "remoteWork",
      label: "Remote Work Preference",
      renderer: "select",
      props: {
        data: [
          { label: "Fully Remote", value: "remote" },
          { label: "Hybrid", value: "hybrid" },
          { label: "On-site", value: "onsite" },
          { label: "Flexible", value: "flexible" }
        ]
      }
    },

    // Legal
    legallyAuthorized: {
      id: "legallyAuthorized",
      label: "I am legally authorized to work in Kenya",
      renderer: "checkbox",
      rules: {
        required: "You must confirm authorization to work"
      }
    },
    agreeToTerms: {
      id: "agreeToTerms",
      label: "I agree to the terms and conditions",
      renderer: "checkbox",
      rules: {
        required: "You must agree to terms"
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
            { kind: "field", fieldId: "email" },
            { kind: "field", fieldId: "phone" }
          ]
        }
      ]
    },
    {
      kind: "section",
      title: "Professional Experience",
      withDivider: true,
      children: [
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "experienceLevel" },
            { kind: "field", fieldId: "yearsOfExperience" },
            { kind: "field", fieldId: "currentlyEmployed", colSpan: 2 }
          ]
        },
        {
          kind: "grid",
          cols: 2,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "currentCompany" },
            { kind: "field", fieldId: "currentPosition" },
            { kind: "field", fieldId: "noticePeriod", colSpan: 2 }
          ]
        }
      ]
    },
    {
      kind: "section",
      title: "Skills & Qualifications",
      withDivider: true,
      children: [
        {
          kind: "stack",
          spacing: "md",
          children: [
            { kind: "field", fieldId: "primarySkills" }
          ]
        }
      ]
    },
    {
      kind: "section",
      title: "Application Materials",
      withDivider: true,
      children: [
        {
          kind: "stack",
          spacing: "md",
          children: [
            { kind: "field", fieldId: "resume" },
            { kind: "field", fieldId: "coverLetter" },
            {
              kind: "grid",
              cols: 3,
              spacing: "md",
              children: [
                { kind: "field", fieldId: "portfolio" },
                { kind: "field", fieldId: "linkedIn" },
                { kind: "field", fieldId: "github" }
              ]
            }
          ]
        }
      ]
    },
    {
      kind: "section",
      title: "Work Preferences",
      withDivider: true,
      children: [
        {
          kind: "grid",
          cols: 3,
          spacing: "md",
          children: [
            { kind: "field", fieldId: "expectedSalary" },
            { kind: "field", fieldId: "remoteWork" },
            { kind: "field", fieldId: "willingToRelocate" }
          ]
        }
      ]
    },
    {
      kind: "section",
      title: "Legal & Confirmation",
      withDivider: false,
      children: [
        {
          kind: "stack",
          spacing: "sm",
          children: [
            { kind: "field", fieldId: "legallyAuthorized" },
            { kind: "field", fieldId: "agreeToTerms" }
          ]
        }
      ]
    }
  ]
};

function RouteComponent() {
  return <div>
    <DynamicForm schema={jobApplicationSchema} />
  </div>
}
