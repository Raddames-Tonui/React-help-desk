# Users Table Data Flow

This document explains the full flow of data from the URL to the table component, including how it interacts with context and API fetching.

---

## 1. URL / Route Layer

* `Route.useSearch()` reads query parameters from the URL:

  * `page`, `pageSize`, `role`, `status`, etc.
* `validateSearch` ensures types: numbers for `page`/`pageSize`, strings for filters.

```
URL: /admin/users/?page=1&pageSize=10&role=admin&status=approved
      │
      ▼
Route.useSearch() → searchParams object
```

---

## 2. Users Context (`UsersProvider`)

* Receives `searchParams` from `UsersPage` (or route) and stores:

  * `page` (number)
  * `pageSize` (number)
  * `params` (role, status, etc.)
* Builds the API URL dynamically:

  ```ts
  `${host}/admin/users/?page=1&pageSize=10&role=admin&status=approved`
  ```
* Fetches data from backend.
* Stores in state:

  * `data` → full API response
  * `users` → array of user objects
  * `loading`, `error`
* Provides functions to update state and refetch (`setPage`, `setPageSize`, `setParams`, `refresh`).

```
UsersProvider
      │
      ├─ state: page, pageSize, params
      ├─ fetchUsers() → API
      ├─ stores: data, users, loading, error
      └─ functions: setPage, setPageSize, setParams, refresh
```

---

## 3. UsersPage Component

* Reads state and functions from `useUsers()` context.
* Passes `users` and pagination info to **DataTable**.
* Handles URL updates when page changes:

  ```ts
  navigate({ search: { page, pageSize, role, status } });
  ```
* Optional: handles filter changes, sort changes, search changes by updating both context and URL.

```
UsersPage
      │
      ├─ useUsers() → reads context
      ├─ columns config → DataTable
      └─ passes pagination and event handlers
```

---

## 4. DataTable (Dummy Table)

* Receives `data`, `columns`, `pagination`, `initialSort`, `initialFilter`, etc.
* Stores its own internal state for:

  * `sortBy`, `filter`, `search`
* Provides hooks for:

  * `onSortApply`, `onFilterApply`, `onSearchApply`, `onRefresh`
* Calls **context functions** when user interacts:

  * Sorting → triggers `onSortApply` → updates URL/context → refetch
  * Pagination → triggers `onPageChange` → updates context/URL → refetch
  * Filtering → triggers `onFilterApply` → updates context/URL → refetch
* Context stores the authoritative state; table just renders and emits events.

```
DataTable
      │
      ├─ receives: columns, users, pagination, initialSort/Filter/Search
      ├─ internal state: sortBy, filter, search
      ├─ renders: TableHeader, TableBody, TableFooter, Pagination
      └─ emits events → context functions → API refetch
```

---

## 5. Full Cycle

```
URL (search params)
      │
      ▼
Route.useSearch()
      │
      ▼
UsersPage (reads searchParams)
      │
      ▼
useUsers() → UsersProvider context
      │
      ▼
DataTable (renders users, handles sort/filter/pagination)
      │
      ▼
User action (sort/filter/page change)
      │
      ▼
onSortApply/onFilterApply/onPageChange
      │
      ▼
Update context → update URL → refetch API
      │
      ▼
UsersProvider fetchUsers() → updates state → DataTable re-renders
```

---

### Key Points / Best Practices

1. **URL is source of truth** for page & filters → ensures bookmarking/sharing works.
2. **Context is authoritative** for fetched data and pagination state.
3. **DataTable only manages local UI state** for sorting/filtering/search input temporarily.
4. **User actions propagate upward**: Table → Context → URL → Backend → Context → Table re-render.
