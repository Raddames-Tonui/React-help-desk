# useFetchData & useMutateData Hooks

## Overview

This document outlines the purpose and usage of the custom hooks `useFetchData` and `useMutateData`.  
These hooks streamline server communication and state management, offering a cleaner alternative to the traditional ContextProvider pattern for handling table data.

## Implementation

- `useContext` is demonstrated in **/src/pages/users/UsersPage.tsx**.  
- `useFetchData` and `useMutateData` are implemented in **/src/pages/subjects/SubjectsPage.tsx**.  
- TanStack Query (formerly React Query) examples are available in **/src/pages/subjects/tanstack-query/**.  
- Check the browser **Network tab** in DevTools and the **__root.tsx** file for provider setup.

---

## CONTENTS

* Checkout Also [Custom Hooks Vs Tabstack Query](./README2.md) for more details.


## 1. useFetchData

### Purpose

`useFetchData` is a custom hook designed for fetching data from the backend with support for:

* Query parameters (pagination, sorting, filtering)
* Authorization headers (using `TOKEN`)
* Loading and error state management

### Example Usage

```ts
const { data, isLoading, error, refresh } = useFetchData<ApiResponse<UserData>>({
  url: '/api/admin/users',
  token: TOKEN,
  params: { page, page_size: pageSize, role: 'admin' },
});
```

* `data` contains the API response.
* `isLoading` is true while the fetch is in progress.
* `error` contains any fetch error.
* `refresh()` can be called to reload the data after updates.

---

## 2. useMutateData

### Purpose

`useMutateData` is a flexible mutation hook for POST, PUT, PATCH, DELETE requests. It supports:

* Sending JSON bodies
* Authorization headers
* Success and error callbacks
* Loading and error states

### Example Usage

```ts
const editRoleMutation = useMutateData<{ role: string }>({
  url: `/api/admin/users/${user.id}/role`,
  method: 'PUT',
  token: TOKEN,
  onSuccess: () => {
    toast.success('Role updated successfully!');
    refresh();
  },
});

// Trigger mutation
editRoleMutation.mutate({ role: 'trainee' });
```

* `mutate(body)` triggers the mutation.
* `data` contains the API response.
* `isLoading` tracks mutation state.
* `error` contains any error returned by the API.

---

## Pros over ContextProvider

Using `useFetchData` and `useMutateData` in place of a ContextProvider offers several advantages:

1. **Scoped State:** Each component manages its own fetch/mutation state, avoiding unnecessary global re-renders.
2. **Flexibility:** Hooks can be used anywhere without wrapping the app in a context.
3. **Simplicity:** Less boilerplate code; no need to define context, provider, and dispatch functions.
4. **Automatic Refresh:** By passing the `refresh` callback to mutation hooks, the UI stays up-to-date seamlessly.
5. **Customizable:** Hooks allow success/error callbacks, toast notifications, and transformations per usage.
6. **Isolation:** Errors or loading states are component-specific, preventing conflicts in larger apps.

---

## Integration with Users Page

In the Users table, `UserActions` uses `useMutateData` for role, status, and deletion operations. `useFetchData` is used at the page level for listing users, pagination, sorting, and filtering.

**Column Example:**

```ts
{
  id: 'actions',
  caption: 'Actions',
  renderCell: (_, row) => <UserActions user={row} onRefresh={refresh} />,
}
```

This ensures:

* Each row has action buttons.
* Mutations trigger toast notifications.
* Data refresh occurs after any change.

---

By using these hooks, the application achieves a clean, modular, and reactive approach to data fetching and mutations without relying on a global ContextProvider.




