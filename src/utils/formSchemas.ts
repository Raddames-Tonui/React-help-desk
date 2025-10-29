/**
 * ================================================================
 * DYNAMIC FORM SCHEMAS - EXAMPLES
 * ================================================================
 *
 * Schema structure:
 * - id: Unique form identifier
 * - meta: Form metadata (title, subtitle, etc.)
 * - fields: Object map of all field definitions
 * - layout: Array of layout nodes defining structure
 */

// ================================================================
// EXAMPLE 1: SIMPLE CONTACT FORM
// ================================================================

export const contactFormSchema: any = {
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

// ================================================================
// EXAMPLE 2: USER REGISTRATION WITH CONDITIONAL FIELDS
// ================================================================

export const registrationFormSchema: any = {
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

// ================================================================
// EXAMPLE 3: AGENT UPDATE FORM (FROM YOUR EXAMPLE)
// ================================================================

export const agentUpdateSchema: any = {
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

// ================================================================
// EXAMPLE 4: PRODUCT FORM WITH COMPLEX CONDITIONS
// ================================================================

export const productFormSchema: any = {
    id: "product-form",
    meta: {
        title: "Add Product",
        subtitle: "Fill in product details"
    },
    fields: {
        // Basic Info
        productName: {
            id: "productName",
            label: "Product Name",
            renderer: "text",
            rules: { required: "Product name is required" }
        },
        category: {
            id: "category",
            label: "Category",
            renderer: "select",
            props: {
                data: [
                    { label: "Electronics", value: "electronics" },
                    { label: "Clothing", value: "clothing" },
                    { label: "Food", value: "food" },
                    { label: "Books", value: "books" }
                ]
            },
            rules: { required: "Category is required" }
        },

        // Electronics Fields
        brand: {
            id: "brand",
            label: "Brand",
            renderer: "text",
            visibleWhen: {
                field: "category",
                op: "equals",
                value: "electronics"
            },
            rules: { required: "Brand is required for electronics" }
        },
        warrantyPeriod: {
            id: "warrantyPeriod",
            label: "Warranty Period (months)",
            renderer: "number",
            visibleWhen: {
                field: "category",
                op: "equals",
                value: "electronics"
            },
            props: {
                min: 0,
                max: 60
            }
        },

        // Clothing Fields
        size: {
            id: "size",
            label: "Size",
            renderer: "select",
            visibleWhen: {
                field: "category",
                op: "equals",
                value: "clothing"
            },
            props: {
                data: ["XS", "S", "M", "L", "XL", "XXL"]
            }
        },
        color: {
            id: "color",
            label: "Color",
            renderer: "multiselect",
            visibleWhen: {
                field: "category",
                op: "equals",
                value: "clothing"
            },
            props: {
                data: ["Red", "Blue", "Green", "Black", "White", "Yellow"]
            }
        },

        // Food Fields
        expiryDate: {
            id: "expiryDate",
            label: "Expiry Date",
            renderer: "date",
            visibleWhen: {
                field: "category",
                op: "equals",
                value: "food"
            },
            props: {
                minDate: new Date()
            },
            rules: { required: "Expiry date is required for food items" }
        },

        // Common Fields
        price: {
            id: "price",
            label: "Price (KES)",
            renderer: "number",
            props: {
                min: 0,
                precision: 2,
                step: 0.01
            },
            rules: {
                required: "Price is required",
                min: { value: 0, message: "Price must be positive" }
            }
        },
        discountApplied: {
            id: "discountApplied",
            label: "Apply Discount",
            renderer: "switch",
            defaultValue: false
        },
        discountPercentage: {
            id: "discountPercentage",
            label: "Discount Percentage",
            renderer: "number",
            visibleWhen: {
                field: "discountApplied",
                op: "equals",
                value: true
            },
            props: {
                min: 0,
                max: 100,
                suffix: "%"
            },
            rules: {
                required: "Discount percentage is required",
                min: { value: 1, message: "Discount must be at least 1%" },
                max: { value: 90, message: "Discount cannot exceed 90%" }
            }
        },
        stock: {
            id: "stock",
            label: "Stock Quantity",
            renderer: "number",
            props: {
                min: 0
            },
            rules: {
                required: "Stock quantity is required",
                min: { value: 0, message: "Stock cannot be negative" }
            }
        },
        description: {
            id: "description",
            label: "Description",
            renderer: "textarea",
            props: {
                minRows: 4
            }
        },
        featured: {
            id: "featured",
            label: "Feature this product",
            renderer: "checkbox",
            defaultValue: false
        }
    },
    layout: [
        {
            kind: "section",
            title: "Basic Information",
            withDivider: true,
            children: [
                {
                    kind: "grid",
                    cols: 2,
                    spacing: "md",
                    children: [
                        { kind: "field", fieldId: "productName" },
                        { kind: "field", fieldId: "category" }
                    ]
                }
            ]
        },
        {
            kind: "section",
            title: "Category-Specific Details",
            withDivider: true,
            collapsible: true,
            children: [
                {
                    kind: "grid",
                    cols: 2,
                    spacing: "md",
                    children: [
                        { kind: "field", fieldId: "brand" },
                        { kind: "field", fieldId: "warrantyPeriod" },
                        { kind: "field", fieldId: "size" },
                        { kind: "field", fieldId: "color" },
                        { kind: "field", fieldId: "expiryDate" }
                    ]
                }
            ]
        },
        {
            kind: "section",
            title: "Pricing & Inventory",
            withDivider: true,
            children: [
                {
                    kind: "grid",
                    cols: 3,
                    spacing: "md",
                    children: [
                        { kind: "field", fieldId: "price" },
                        { kind: "field", fieldId: "stock" },
                        { kind: "field", fieldId: "discountApplied" },
                        { kind: "field", fieldId: "discountPercentage", colSpan: 2 }
                    ]
                }
            ]
        },
        {
            kind: "section",
            title: "Additional Information",
            withDivider: false,
            children: [
                {
                    kind: "stack",
                    spacing: "md",
                    children: [
                        { kind: "field", fieldId: "description" },
                        { kind: "field", fieldId: "featured" }
                    ]
                }
            ]
        }
    ]
};

// ================================================================
// EXAMPLE 5: ADDRESS FORM WITH COUNTRY-DEPENDENT FIELDS
// ================================================================

export const addressFormSchema: any = {
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

// ================================================================
// EXAMPLE 6: JOB APPLICATION FORM
// ================================================================

export const jobApplicationSchema: any = {
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

// ================================================================
// EXAMPLE 7: MULTI-CONDITION FORM
// ================================================================

export const insuranceQuoteSchema: any = {
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