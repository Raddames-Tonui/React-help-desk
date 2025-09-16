# TanStack Router Hooks Documentation

This guide explains the most commonly used hooks in **TanStack Router**: `useSearch`, `useSearchParams`, `useParams`, and `useNavigate`. Each section includes explanation, use cases, and example code.

---

## 1. `useParams`

### Purpose

* Access **dynamic route parameters** defined in your route path.
* Useful when your route has segments like `/users/$id`.

### Example

```tsx
// Route definition
export const Route = createFileRoute('/users/$id')({
  component: UserPage,
})

// Usage inside component
import { useParams } from '@tanstack/react-router'

const UserPage = () => {
  const { id } = useParams({ from: '/users/$id' }) // ✅ 'id' comes from URL

  return <div>User ID: {id}</div>
}
```

### Use Cases

* Getting `id` for fetching data (`/users/123`).
* Handling nested resources like `/orders/$orderId/items/$itemId`.

---

## 2. `useSearch`

### Purpose

* Access **typed search params** (query string) from the URL.
* Requires route definition to declare expected search params.

### Example

```tsx
// Route with search schema
type SearchSchema = { page?: number; sort?: string }

export const Route = createFileRoute('/products/')({
  validateSearch: (search: Record<string, unknown>): SearchSchema => ({
    page: Number(search.page ?? 1),
    sort: String(search.sort ?? 'name'),
  }),
  component: ProductPage,
})

// Usage
import { useSearch } from '@tanstack/react-router'

const ProductPage = () => {
  const search = useSearch({ from: '/products/' })
  // ✅ search.page and search.sort are typed

  return (
    <div>
      Page: {search.page}, Sort by: {search.sort}
    </div>
  )
}
```

### Use Cases

* Pagination (`?page=2`).
* Sorting (`?sort=name`).
* Filtering (`?category=books&inStock=true`).

---

## 3. `useSearchParams`

### Purpose

* Directly read and write raw query params as a `URLSearchParams` object.
* Lower-level than `useSearch`. Useful when no validation schema is needed.

### Example

```tsx
import { useSearchParams } from '@tanstack/react-router'

const SearchExample = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = searchParams.get('page') ?? '1'

  const nextPage = () => {
    setSearchParams({ page: String(Number(page) + 1) })
  }

  return (
    <div>
      Page: {page}
      <button onClick={nextPage}>Next</button>
    </div>
  )
}
```

### Use Cases

* Quick manipulation of query strings.
* Dynamic filters where schema is not predefined.

---

## 4. `useNavigate`

### Purpose

* Programmatically navigate to another route.
* Can push or replace history entries.
* Supports updating `params`, `search`, and `hash`.

### Example

```tsx
import { useNavigate } from '@tanstack/react-router'

const NavExample = () => {
  const navigate = useNavigate({ from: '/products/' })

  const goToPage2 = () => {
    navigate({
      to: '/products/',
      search: { page: 2, sort: 'price' },
    })
  }

  return <button onClick={goToPage2}>Go to Page 2</button>
}
```

### Use Cases

* Redirect after login.
* Navigate on button clicks or form submissions.
* Update query params while staying on the same route.

---

## 5. Putting It All Together

Here’s an example combining all four hooks:

```tsx
export const Route = createFileRoute('/users/$id')({
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
  }),
  component: UserDetail,
})

const UserDetail = () => {
  const { id } = useParams({ from: '/users/$id' })
  const search = useSearch({ from: '/users/$id' })
  const navigate = useNavigate({ from: '/users/$id' })

  return (
    <div>
      <h1>User: {id}</h1>
      <p>Viewing page {search.page}</p>

      <button
        onClick={() =>
          navigate({
            search: { page: search.page + 1 },
          })
        }
      >
        Next Page
      </button>
    </div>
  )
}
```

---

## ✅ Summary

* **`useParams`** → Get dynamic path params.
* **`useSearch`** → Get validated, typed query params.
* **`useSearchParams`** → Get/set raw query params directly.
* **`useNavigate`** → Programmatically navigate with params/search/hash.

Each of these hooks is designed to make routing **type-safe, declarative, and URL-persistent** in TanStack Router.
