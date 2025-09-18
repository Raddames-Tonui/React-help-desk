# DataTable Component Documentation

## Overview

The `DataTable` component is a highly reusable React table that provides context-based state management for child components like `TableActions`, `TableHeader`, `TableBody`, `TableFooter`, and `Pagination`. It acts as a "dummy" wrapper, storing state in context for easy access and manipulation by its children without prop-drilling.

---

DataTable

&#x20;├─ TableActions

&#x20;├─ TableHeader

&#x20;├─ TableBody

│      └─ Row

&#x20;│       └─ SubRows (expandable)

&#x20;├─ TableFooter

&#x20;├─ Pagination

&#x20;├─css/DataTable.css                      // styling is centralized here

&#x20;└─ Modals

&#x20;│       └─ Modal filter

&#x20;│       └─ Modal Sort

│       └─ Modal\\

## Props

| Prop                | Type                                                         | Description                                                                                      |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `columns`           | `ColumnProps<T>[]`                                           | Column definitions, including caption, size, alignment, render functions, and sort/filter flags. |
| `data`              | `T[]`                                                        | Array of rows to render in the table.                                                            |
| `tableActionsLeft`  | `React.ReactNode`                                            | Custom buttons or actions to show above the table, left-aligned.                                 |
| `tableActionsRight` | `React.ReactNode`                                            | Custom buttons or actions to show above the table, right-aligned.                                |
| `rowRender`         | `(row: T, defaultCells: React.ReactNode) => React.ReactNode` | Optional custom row rendering function.                                                          |
| `pagination`        | `PaginationProps`                                            | Pagination configuration (`page`, `pageSize`, `total`, `onPageChange`).                          |
| `initialSort`       | `string`                                                     | Initial sort string or array serialized as string. Passed to context as `SortRule[]`.            |
| `initialFilter`     | `string`                                                     | Initial filter string or array serialized as string. Passed to context as `FilterRule[]`.        |
| `initialSearch`     | `string`                                                     | Initial search string or array serialized as string. Passed to context as `string[]`.            |
| `onSortApply`       | `(rules: SortRule[]) => void`                                | Callback when sort rules are applied. Updates context state.                                     |
| `onFilterApply`     | `(rules: FilterRule[]) => void`                              | Callback when filter rules are applied. Updates context state.                                   |
| `onSearchApply`     | `(arr: string[]) => void`                                    | Callback when search is applied. Updates context state.                                          |
| `onRefresh`         | `() => void`                                                 | Optional refresh handler.                                                                        |

---

## Context / React State

The `DataTable` component stores key UI state in context for child components to consume:

```ts
      const [sortBy, setSortBy] = useState<SortRule[]>([]);
const [filter, setFilter] = useState<FilterRule[]>([]);
const [search, setSearch] = useState<string[]>([]);
```

**Why arrays?**

* Easier to manipulate programmatically (add, remove, reorder).
* Type-safe (`SortRule[]`, `FilterRule[]`, `string[]`).
* Works seamlessly with TableActions, Modals, and other children components.

---

## URL Persistence

Since URLs only store strings, we serialize arrays before saving to the URL.

### Options for serialization:

**1. Comma-separated simple arrays**

```ts
const urlValue = search.join(",");
const searchArray = urlValue ? urlValue.split(",") : [];
```

* Simple, works for strings without commas.

**2. JSON encoding (safe for any string)**

```ts
const urlValue = encodeURIComponent(JSON.stringify(search));
const searchArray = JSON.parse(decodeURIComponent(urlValue));
```

* Handles commas, quotes, spaces safely.
* Slightly longer URLs.

**3. OData-style for complex rules (recommended for sort/filter)**

```text
sort=Name asc,Age desc
filter=contains(Name,'John') and Age gt 25
```

* Human-readable.
* Backend-compatible.
* Can parse back into arrays when reading from the URL.

---

## Best Practices

| Location        | Data Type                                        | Notes                                                                                          |
| --------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Context / State | Array (`SortRule[]`, `FilterRule[]`, `string[]`) | Type-safe, easy for components to manipulate.                                                  |
| URL             | String (serialize array)                         | Parse back to array on mount. Use OData style for sort/filter, JSON/comma for simple searches. |
| Backend         | Array / OData Query                              | Convert URL string to proper array/OData format before sending API requests.                   |

---

## Flow Example

1. User sets filters in the modal → context/state updated (`filter: FilterRule[]`).
2. Update URL by serializing array → `filter=contains(Name,'John') and Age gt 25`.
3. On page load or refresh:

   * Read URL → parse string → update context arrays.
4. Context arrays are used for rendering, table actions, or sending API requests.

**Advantages:**

* State arrays make UI logic easy.
* URL strings make state persistent across refresh or sharing.
* Backend always gets a properly formatted query.

---

## Example Usage

```tsx
import { DataTable, ColumnProps, SortRule, FilterRule } from './DataTable';

const columns: ColumnProps<Person>[] = [
  { id: 'UserName', caption: 'Username', size: 150, isSortable: true },
  { id: 'FirstName', caption: 'First Name', size: 150, isSortable: true },
  { id: 'LastName', caption: 'Last Name', size: 150 },
];

<DataTable<Person>
  columns={columns}
  data={people}
  pagination={{ page: 1, pageSize: 10, total: totalCount, onPageChange: setPage }}
  initialSort={"UserName asc"}
  initialFilter={"contains(FirstName,'John')"}
  initialSearch={"John"}
  onSortApply={(rules: SortRule[]) => console.log(rules)}
  onFilterApply={(rules: FilterRule[]) => console.log(rules)}
  onSearchApply={(arr: string[]) => console.log(arr)}
/>
```

This ensures:

* Sorting, filtering, and search states are managed centrally in context.
* Child components like modals and table headers can consume and update state.
* State persists via URL serialization and can be rehydrated on page refresh.
