# TanStack Router Integration

## Project Overview

This project demonstrates a fully implemented React application using **TanStack Router**, **useReducer for state management**, **OData data fetching**, a **rich text Ticket Form with TipTap**, and **React Hook Form (RHF) with Yup validation**. All major features have been implemented, including routing for public and protected pages, dynamic nested routes, and state management for both tables and forms.

---

## Project Structure with TanStack Router

The project uses a structured folder layout for **public** and **protected** routes:

```
/src/routes
  |_ _protected
      |_ vendor/index.tsx
      |_ client/index.tsx
          |_ $vendor.tsx
      |_ odata/index.tsx
  |_ _public
      |_ login/index.tsx
      |_ register/index.tsx
  |_ _protected.tsx  // file for protected layout/routes
```

### Key Points:

* `_protected` folder: Contains pages only accessible to authenticated users.
* `_public` folder: Contains pages available to all users.
* `vendor$` and `client/$vendor` routes: Illustrate dynamic nested routing.
* `_protected.tsx`: Central layout file that wraps all protected pages.
* `__root`: Root route that initializes the router and sets up layouts.

---

## Routing Concepts in TanStack Router

### Route Definition

Routes are structured hierarchically and can be nested for modularity:

```ts
import { createRouter, Route } from '@tanstack/router';

const rootRoute = new Route({ path: '/', component: RootLayout });
const protectedRoute = new Route({ path: 'protected', parent: rootRoute, component: ProtectedLayout });
const vendorRoute = new Route({ path: 'vendor', parent: protectedRoute, component: VendorPage });
const odataRoute = new Route({ path: 'odata', parent: protectedRoute, component: OdataPage });
```

### Layouts

* **RootLayout (`__root`)**: Provides the global wrapper (header, footer, nav).
* **ProtectedLayout (`_protected.tsx`)**: Wraps all protected pages and ensures authentication.
* Public routes can have a separate `PublicLayout`.

### Dynamic Routes (`$` syntax)

* `$vendor.tsx` inside `client` represents a dynamic route parameter.
* Accessed via hooks like `useSearch()` to read query params.
* Example URL: `/client/vendor123` maps to `$vendor.tsx` with `vendor` param.

---

## TanStack Router Hooks

### `useNavigate`

* Used to programmatically navigate to another route.
* Can include **path parameters** and **search params**.

#### Example: Navigate to vendor page with parameters

```ts
import { useNavigate } from '@tanstack/router';

const navigate = useNavigate();

navigate({
  to: '/protected/client/vendor123',
  params: { vendor: 'vendor123' },
  search: { ref: 'dashboard', page: '1' }
});
```

### `useSearch`

* Retrieves query parameters from the URL.
* Example:

```ts
import { useSearch } from '@tanstack/router';

const search = useSearch();
console.log(search.ref); // 'dashboard'
console.log(search.page); // '1'
```

* Useful for filtering, sorting, or handling dynamic data fetches based on URL parameters.

---

## Integration with useReducer and Data Fetching

* **OData Table**: Uses `useReducer` to handle state for filtering, sorting, pagination.
* State dispatch actions update the URL search parameters, allowing deep linking and bookmarking.
* **Ticket Form**: Also uses `useReducer` to manage input fields, file uploads, and TipTap content.

### Example of useReducer with Route Params

```ts
const [state, dispatch] = useReducer(reducer, initialState);
const search = useSearch();

useEffect(() => {
  if(search.vendor) {
    dispatch({ type: 'SET_FILTER', filter: `VendorId eq '${search.vendor}'` });
  }
}, [search.vendor]);
```

---

## React Hook Form (RHF) and Yup Integration

### Purpose

* **React Hook Form (RHF)**: Efficient form state management, minimal re-renders.
* **Yup**: Schema-based validation.
* **@hookform/resolvers**: Connects Yup with RHF for declarative validation.

### Example Usage

```ts
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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
    localStorage.setItem('formData', JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} placeholder='Username' />
      {errors.username && <span>{errors.username.message}</span>}

      <input {...register('email')} placeholder='Email' />
      {errors.email && <span>{errors.email.message}</span>}

      <button type='submit'>Submit</button>
    </form>
  );
};
```

### Benefits

* Declarative and centralized validation.
* Efficient state handling without re-rendering the entire form.
* Easy integration with other UI libraries and custom inputs.

---

## Summary

This project demonstrates:

1. **TanStack Router**: Advanced routing with nested routes, dynamic params, protected layouts, and public layouts.
2. **useNavigate & useSearch**: Programmatic navigation with path and query parameters.
3. **useReducer**: Centralized state management for forms and tables.
4. **OData Fetching & Pagination**: Fetching from OData endpoints with filters and sorting.
5. **TipTap Editor**: Rich text editor integrated into forms.
6. **React Hook Form & Yup**: Efficient form state management with schema-based validation.

The combination of these tools ensures a scalable, maintainable, and robust architecture for complex React applications.
