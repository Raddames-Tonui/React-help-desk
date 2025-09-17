# React Project Documentation: OData Fetching & Form Management with useReducer

## Project Overview

This React project demonstrates advanced state management using the `useReducer` hook, client-side routing with `react-router-dom`, fetching data from an OData API, and implementing rich text editing with TipTap. It includes two main features:

1. **OData Table Component** – Fetches data from an OData service, supports filtering, sorting, and pagination.
2. **Ticket Form Component** – Allows users to create tickets with fields, file uploads, and a rich text description using TipTap.

Both features leverage `useReducer` for predictable state management.

---

## Table Component: Fetching OData

### Dependencies

* `react`, `react-dom`
* `react-router-dom`
* OData REST service (e.g., TripPin OData service)
* CSS for styling table and loader

### Key Concepts

1. **useReducer for State Management**:

   * Centralizes state handling for filters, sorting, pagination, and data fetching.
   * Provides clear actions (`SET_FILTER`, `SET_SORT`, `SET_PAGE`, `FETCH_START`, `FETCH_SUCCESS`, `FETCH_ERROR`) to update state.

2. **Data Fetching**:

   * Uses `fetch()` with query parameters for `$top`, `$skip`, `$filter`, and `$orderby`.
   * Dispatches `FETCH_START` before the request and `FETCH_SUCCESS` or `FETCH_ERROR` after.

3. **React Table Rendering**:

   * Columns are defined with captions, sizes, and optional `render` functions for custom cell content.

### Reducer Function Example

```ts
function reducer(state: any, action: any) {
  switch (action.type) {
    case "SET_FILTER": return { ...state, filter: action.filter, page: 1 };
    case "SET_SORT": return { ...state, sort: action.sort, page: 1 };
    case "SET_PAGE": return { ...state, page: action.page };
    case "FETCH_START": return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS": return { ...state, data: action.data, loading: false };
    case "FETCH_ERROR": return { ...state, error: action.error, loading: false };
    default: return state;
  }
}
```

### Usage

* **Filter Input** updates state with OData `$filter` query.
* **Sort Dropdown** updates state with `$orderby` query.
* **Pagination** updates the `page` property.
* **Table Component** renders the data dynamically.

---

## Ticket Form Component

### Dependencies

* `react`, `react-dom`
* TipTap Editor (`@tiptap/react`, `@tiptap/starter-kit`, extensions)
* CSS for styling form and TipTap editor

### Key Concepts

1. **useReducer for Form State**:

   * Manages fields: `mainCategory`, `subCategory`, `problem`, `description`, `files`.
   * Actions include setting fields, handling file uploads, removing files, and resetting form.

2. **File Upload Handling**:

   * Converts files to Base64 before saving in local storage.
   * Allows multiple files with removal capability.

3. **Form Submission**:

   * Saves form state to local storage.
   * Resets form after submission.

### Reducer Example

```ts
type Action =
  | { type: "SET_FIELD"; field: keyof State; value: string }
  | { type: "SET_DESCRIPTION"; value: string }
  | { type: "SET_FILES"; files: File[] }
  | { type: "REMOVE_FILE"; index: number }
  | { type: "RESET" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD": return { ...state, [action.field]: action.value };
    case "SET_DESCRIPTION": return { ...state, description: action.value };
    case "SET_FILES": return { ...state, files: action.files };
    case "REMOVE_FILE": return { ...state, files: state.files.filter((_, i) => i !== action.index) };
    case "RESET": return initialState;
    default: return state;
  }
}
```

---

## TipTap Editor Integration

### What is TipTap?

TipTap is a modern, headless rich-text editor for React, built on ProseMirror. It allows developers to create fully customizable editors with extensions for images, videos, links, text formatting, and more.

### Usage in Project

* The `Editor` component wraps `useEditor` and `EditorContent`.
* Includes extensions: `StarterKit`, `Underline`, `Link`, `Image`, `Youtube`, `TextAlign`, `Subscript`, `Superscript`.
* Provides a toolbar for formatting and media embedding.
* Updates parent component state via `onChange` callback.

### Example Snippet

```ts
const editor = useEditor({
  extensions: [StarterKit, Underline, Link, Image, Youtube, TextAlign],
  content: value,
  onUpdate: ({ editor }) => { onChange?.(editor.getHTML()); }
});
```

---

## React Router Integration

* Handles multiple pages or routes within the app.
* Recommended to use `<BrowserRouter>` at root and `<Routes>` / `<Route>` for pages.
* Allows smooth navigation between OData table and Ticket form.

### Example

```ts
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/odata" element={<Odata />} />
    <Route path="/ticket" element={<Client />} />
  </Routes>
</BrowserRouter>
```

---

## Best Practices for useReducer

1. **Define a clear initial state** to prevent undefined values.
2. **Use action types consistently** to manage different state changes.
3. **Keep reducers pure** – avoid side effects; handle async actions outside with `useEffect`.
4. **Combine with context** for global state management if needed.
5. **Use helper functions** for complex state updates, like filtering or file handling.

This project demonstrates a robust pattern combining `useReducer` for predictable state, OData fetching for external data, TipTap for rich content, and `react-router-dom` for routing in React.
