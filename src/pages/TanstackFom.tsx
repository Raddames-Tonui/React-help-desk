import { useState } from "react";
import { DynamicTanStackForm } from "@/tanstack-react-form/DynamicTanStackForm";

import {
  contactFormSchema,
  registrationFormSchema,
  agentUpdateSchema,
  productFormSchema,
  addressFormSchema,
  jobApplicationSchema,
  insuranceQuoteSchema,
} from "@/dynamic-form/utils/formSchemas"; 

const TanstackFom = () => {
  const [selectedForm, setSelectedForm] = useState<string>("");

  const forms = [
    { label: "Example 1: Simple Contact Form", value: "contact", schema: contactFormSchema },
    { label: "Example 2: User Registration with Conditional Fields", value: "registration", schema: registrationFormSchema },
    { label: "Example 3: Agent Update Form", value: "agent", schema: agentUpdateSchema },
    { label: "Example 4: Product Form with Complex Conditions", value: "product", schema: productFormSchema },
    { label: "Example 5: Address Form with Country-Dependent Fields", value: "address", schema: addressFormSchema },
    { label: "Example 6: Job Application Form", value: "job", schema: jobApplicationSchema },
    { label: "Example 7: Multi-Condition Form", value: "insurance", schema: insuranceQuoteSchema },
  ];

  const currentForm = forms.find((form) => form.value === selectedForm);

  return (
    <section className="home-container">
      <div className="form-selector">
        <label htmlFor="formSelect" className="select-label">
          Select Form
        </label>
        <select
          id="formSelect"
          value={selectedForm}
          onChange={(e) => setSelectedForm(e.target.value)}
        >
          <option value=""> Select a Form </option>
          {forms.map((form) => (
            <option key={form.value} value={form.value}>
              {form.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-display">
        {currentForm ? (
          <DynamicTanStackForm
            key={currentForm.value}
            schema={currentForm.schema}
          />
        ) : (
          <p className="placeholder-text">Select a form to begin filling it.</p>
        )}
      </div>
    </section>
  );
};

export default TanstackFom;
