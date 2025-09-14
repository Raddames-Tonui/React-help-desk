# Project README

## Overview

This project is a **React + TypeScript** application built with **Vite** and leveraging modern tools and libraries:

* **TanStack Router** → for flexible, file-based routing.
* **React Hook Form (RHF)** → for efficient form state management.
* **Yup** → for schema-based form validation with RHF resolvers.
* **LocalStorage & SessionStorage** → for persistence and session handling.
* **TipTap** → for rich text area handling.
* **Dynamic Tables** → for rendering interactive data views.
* **useReducer** → for predictable state management.
* **OData** → for structured data querying.

This project follows a **monorepo structure** with:

* `clients`
* `vendor`
* `lib/shared`

Package manager: **pnpm**
Version control: **git**

---

## Features Implemented

* ✅ Routing with **TanStack Router**
* ✅ Form handling with **React Hook Form**
* ✅ Validation with **Yup** & `@hookform/resolvers`
* ✅ LocalStorage for saving form data
* ✅ SessionStorage for user session handling
* ✅ TipTap integration for text area fields
* ✅ Dynamic table rendering
* ✅ useReducer for complex state management
* ✅ OData integration for structured queries

---

## Installation

```bash
# Install dependencies
pnpm install

# Install form libraries
pnpm add react-hook-form
pnpm add yup @hookform/resolvers
```

---

## Usage

### Form Setup

```tsx
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Schema validation with Yup
const schema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
});

const Form = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    localStorage.setItem("formData", JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("username")} placeholder="Username" />
      {errors.username && <span>{errors.username.message}</span>}

      <input {...register("email")} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <button type="submit">Submit</button>
    </form>
  );
};
```

---

## To-Do

* [ ] Submit to **LocalStorage**
* [ ] Display submitted data
* [ ] Encrypt LocalStorage data
* [ ] Filter and sort rows/columns in dynamic table
* [ ] Display **success/error toasts** on form submission

---

## Routing Example

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pages/vendor/$id")({
  component: VendorPage,
});

function VendorPage() {
  const params = Route.useParams();
  // params.county, params.id available
}
```

---

## Hooks in Use

* `useParams` → fetch route params
* `searchParams` → query string management
* `useReducer` → structured state updates

---

## Storage

* **LocalStorage** → stores form submissions, user lookups (by username or email).
* **SessionStorage** → stores session information.

---

## Development Workflow

1. Clone repository
2. Run `pnpm install`
3. Start dev server:

   ```bash
   pnpm dev
   ```

---

## Monorepo Structure

```
root/
 ├─ clients/
 ├─ vendor/
 ├─ lib/
 │   └─ shared/
 └─ package.json
```

---

## Next Steps

* Integrate encryption for stored data.
* Add toast notifications (success/error).
* Implement advanced filtering/sorting on tables.
* Improve TipTap editor features.

---

## Key Takeaways

* **Schema Validation with Yup** → eliminates manual checks.
* **RHF + Yup** → smooth form handling & validation.
* **Storage Strategy** → LocalStorage for persistence, SessionStorage for sessions.
* **TanStack Router** → flexible, modern routing for React apps.
