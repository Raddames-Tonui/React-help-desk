# Custom Hooks Documentation: useFetchData & useMutateData

## Overview

This README explains the custom hooks `useFetchData` and `useMutateData` implemented in our project, comparing them with **TanStack Query** (React Query) and highlighting their advantages over a traditional context provider.

---

## Core Purpose

| Feature       | `useFetchData` / `useMutateData`               | TanStack Query                                                         |
| ------------- | ---------------------------------------------- | ---------------------------------------------------------------------- |
| Data fetching | Manual fetching from API via `fetch`           | Automatic data fetching with caching, refetching, and stale management |
| Mutations     | Custom mutation logic with `mutate`            | Built-in `useMutation` hook with automatic cache invalidation          |
| Cache         | No global caching; each hook instance is local | Global caching and deduplication; multiple components share data       |
| Dev tools     | None by default                                | Full DevTools for React to inspect queries and mutations               |

---

## API Design & Usage

**Your hooks**: Simple, lightweight, easy to understand. Explicitly pass `url`, `method`, `token`, and success/error callbacks.

```ts
const { data, isLoading, mutate } = useMutateData<{ role: string }>({
  url: `/api/admin/users/${userId}/role`,
  method: 'PUT',
  token: TOKEN,
  onSuccess: () => console.log('Success!')
});
```

**TanStack Query**: Uses **query keys** and automatically manages caching, invalidation, and background refetching.

```ts
const queryClient = useQueryClient();
const { mutate } = useMutation(
  (role: string) => fetch(`/api/admin/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  { onSuccess: () => queryClient.invalidateQueries(['users']) }
);
```

---

## Features Comparison

| Feature                      | `useFetchData` / `useMutateData` | TanStack Query                                   |
| ---------------------------- | -------------------------------- | ------------------------------------------------ |
| Caching                      | ❌ local state only               | ✅ automatic and global                           |
| Deduping requests            | ❌ manual                         | ✅ automatic deduplication                        |
| Stale/Background updates     | ❌ manual                         | ✅ background refetching, refetch on window focus |
| Pagination / Infinite scroll | ❌ manual                         | ✅ built-in support                               |
| Optimistic updates           | ❌ manual                         | ✅ supported                                      |
| DevTools                     | ❌ none                           | ✅ fully integrated                               |
| Retry on failure             | ❌ manual                         | ✅ built-in configurable                          |

---

## Pros of Custom Hooks vs Context Provider

* Simpler to implement for small apps or specific pages.
* No global state; each component fetches its own data.
* Works with minimal dependencies.
* Full control of request headers, tokens, and transformations per instance.

**Cons vs TanStack Query**:

* No global cache sharing; multiple components fetching the same data will duplicate requests.
* Manual handling of retries, invalidation, and optimistic updates.
* No automatic state syncing across components.

---

## Summary

* **Your hooks**: Lightweight, explicit, perfect for simple apps or specific endpoints.
* **TanStack Query**: Advanced, scalable, designed for complex apps with caching, global state sync, deduplication, and dev tools.

> Practical tip: For a school management system with many users, courses, and dynamic updates, **TanStack Query would scale better**. Custom hooks are excellent for learning and small-to-medium features.
