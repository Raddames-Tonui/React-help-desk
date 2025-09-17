# Dynamic DataTable Component

This document explains the creation of a **dynamic, expandable DataTable** in React with TypeScript, from start to finish, using context to avoid prop drilling and raw CSS for styling.

## Component Tree

```
DataTable
 ├─ TableActions
 ├─ TableHeader
 ├─ TableBody
 │   └─ Row
 │       └─ SubRows (expandable)
 ├─ TableFooter
 └─ DataTable.css   // styling is centralized here
```

---

## 1. DataTable (Parent Component)

`DataTable` is the main component that holds the table data, columns, actions, and optional pagination. It provides a **context** (`DataTableContext`) so all child components can access table state without prop drilling.

### Props

```ts
interface DataTableProps<T> {
    columns: ColumnProps<T>[];
    data: T[];
    tableActionsLeft?: React.ReactNode;
    tableActionsRight?: React.ReactNode;
    rowRender?: (row: T, defaultCells: React.ReactNode) => React.ReactNode;
    pagination?: PaginationProps;
}
```

### Features

* Context-based state sharing
* Row-level custom rendering (`rowRender`)
* Table actions support (left & right)
* Optional pagination support

### Example Usage

```tsx
<DataTable
    columns={columns}
    data={data}
    tableActionsLeft={<button>Add Row</button>}
    tableActionsRight={<button>Export</button>}
    rowRender={(row, defaultCells) => (
        <>{defaultCells}</>
    )}
    pagination={{ page: 1, pageSize: 10, total: 100, onPageChange: handlePageChange }}
/>
```

---

## 2. TableHeader

`TableHeader` reads columns from context and renders `<th>` for each visible column. It supports column-level custom rendering via `renderColumn`.

### Features

* Dynamic column rendering
* Hide columns using `hide` prop
* Supports alignment (`left`, `center`, `right`)

```tsx
<TableHeader />
```

---

## 3. TableBody

`TableBody` renders all rows using `Row` component. Each `Row` can optionally have expandable `SubRows`.

### Row Component

* Reads columns & rowRender from context
* Renders default cells or uses `rowRender` for full row customization
* Handles expandable sub-rows

```tsx
<TableBody />
```

### Features

* Row-level custom rendering
* Expandable sub-rows
* Dynamic cell rendering based on `renderCell`
* Hidden columns respected

---

## 4. TableFooter

`TableFooter` renders pagination controls if `pagination` prop is provided.

### Features

* Previous/Next navigation
* Displays current page and total pages
* Fully raw CSS styling

```tsx
<TableFooter />
```

---

## 5. DataTable.css

All styling is centralized here. Example:

```css
.table-header { background-color: #f0f0f0; font-weight: bold; }
.table-row { border-bottom: 1px solid #ddd; cursor: pointer; }
.sub-row { background-color: #fafafa; }
.align-left { text-align: left; }
.align-center { text-align: center; }
.align-right { text-align: right; }
.table-footer { background-color: #f9f9f9; font-weight: bold; }
.pagination-cell { text-align: center; padding: 10px 0; }
.pagination-btn { padding: 5px 10px; margin: 0 5px; cursor: pointer; }
.pagination-btn:disabled { cursor: not-allowed; opacity: 0.5; }
.pagination-info { margin: 0 10px; }
```

---

## 6. Example Full Use Case

```tsx
import React, { useState } from 'react';
import { DataTable, TableHeader, TableBody, TableFooter } from './DataTable';

const columns = [
  { id: 'id', caption: 'ID', size: 50 },
  { id: 'name', caption: 'Name', size: 150 },
  { id: 'age', caption: 'Age', size: 50, align: 'center' },
];

const data = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
];

function App() {
  const [page, setPage] = useState(1);

  return (
    <DataTable
      columns={columns}
      data={data}
      tableActionsLeft={<button>Add</button>}
      tableActionsRight={<button>Export</button>}
      pagination={{ page, pageSize: 10, total: data.length, onPageChange: setPage }}
    >
      <thead><TableHeader /></thead>
      <tbody><TableBody /></tbody>
      <TableFooter />
    </DataTable>
  );
}
```

### Features in this example

* Two table actions (Add, Export)
* Pagination support
* Column alignment and dynamic rendering
* Ready for expandable sub-rows
* Styling controlled via `DataTable.css`

---

This setup is **fully type-safe, flexible, and context-driven**, making it easy to extend with sorting, filtering, or advanced row rendering.
