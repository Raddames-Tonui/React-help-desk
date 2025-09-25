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

# High-level architecture (front end)

* **UI layer**: React + Tailwind (or your UI system). Reusable components (Input, Modal, Table, DataTable).
* **Form layer**: `react-hook-form` + `zod` resolver for validation and type-safety.
* **Data layer**: `@tanstack/react-query` for fetching, caching, mutations, optimistic updates.
* **Routing**: `@tanstack/react-router` file-based routes; nested routes for subject → tasks.
* **ID obfuscation**: Prefer server-side opaque IDs (UUID or Hashid) — client treats them as opaque strings. If you must obfuscate on client, use Hashids library with server-shared salt (not recommended for security).
* **State sharing**: Use react-query cache + context hooks for local UI state (modals), avoid prop-drilling.
* **Auth & security**: JWT / session cookie; server-side authorization checks for every request (do not rely on obfuscated IDs for security).

---

# Folder structure (recommended)

```
src/
├─ api/
│  ├─ client.ts                // fetch wrapper + auth token handling
│  ├─ subjects.api.ts
│  └─ tasks.api.ts
├─ app/
│  ├─ routes/                  // file-based TanStack Router routes
│  │  ├─ _layout.tsx
│  │  ├─ subjects/
│  │  │  ├─ index.tsx          // list/create subjects
│  │  │  └─ $subjectId/
│  │  │     ├─ index.tsx       // subject detail + tasks list
│  │  │     └─ tasks/
│  │  │         └─ create.tsx  // modal or page for creating task
│  ├─ hooks/                   // custom hooks (queries & mutations)
│  │  ├─ useSubjects.ts
│  │  ├─ useSubject.ts
│  │  ├─ useCreateSubject.ts
│  │  ├─ useTasks.ts
│  │  ├─ useTask.ts
│  │  └─ useCreateTask.ts
├─ components/
│  ├─ forms/
│  │  ├─ SubjectForm.tsx
│  │  └─ TaskForm.tsx
│  ├─ table/
│  └─ Modal.tsx
├─ constants.tsx
├─ lib/
│  └─ hashid.ts                // hashid helpers (if used)
└─ main.tsx
```

---

# Routing & passing subject id (TanStack Router)

**Structure & approach**

* Use nested routes: `/subjects` → `/:subjectId` → `/tasks/create`.
* When creating tasks from the subject page, either:

  * Use a **nested route** `/subjects/:subjectId/tasks/create` so `subjectId` is a route param available to the page/component and TaskForm; or
  * Use a **modal** opened with router state while staying on subject page; pass subjectId as route param or via route state. I strongly prefer nested routes — easier to bookmark and refresh.
* In TanStack Router file-based, the `$subjectId` folder automatically surfaces `subjectId` as a param; use the `useParams()` (or route loader) to access it.

**Example route tree (conceptual)**:

```
/subjects               -> list
/subjects/:subjectId    -> subject detail (shows tasks for that subject)
/subjects/:subjectId/tasks/create -> create task for subjectId (form)
```

**How to pass subjectId to task creation**

* Get `subjectId` from route params in the create task component and include it in the mutation payload.
* If you open a modal from the subject list, navigate to `/subjects/:subjectId/tasks/create` (router push) which renders modal; get `subjectId` from params.

---

# IDs in URLs — hide or obfuscate?

**My opinion (production):**

* Use **non-sequential, opaque IDs** server-side (UUIDv4 or Hashid). Exposing a UUID or hashid in URL is fine; **do not** store sequential numeric IDs if you don’t want easy scraping/enumeration.
* Security must not depend on obscurity. Always enforce server-side authorization.
* If you want short URLs, use server-generated slugs or Hashids (example: `subject/5a3f-xyz`).

**Options**

1. **Best**: Server issues opaque IDs (UUIDs). Use them in URL `/subjects/7b9c...`. No extra client work.
2. **If you insist on obfuscation**: Use Hashids. Keep salt on server; server returns hashed id; client uses that hashed id in URLs. Don’t try to compute or derive server IDs client-only.
3. **Signing**: The server can sign an ID (HMAC) and return `id:base64|sig` — client passes it back; server verifies signature. More secure but more complex.

**Implementation tip:** expose both `id` (internal) and `publicId` (opaque) from server. Client only stores `publicId`.

---

# API & query design (React Query)

**Query keys**

* Use structured keys:

  * `["subjects", { page, page_size, filter }]`
  * `["subject", subjectId]`
  * `["tasks", { subjectId, page, filter }]`
  * `["task", taskId]`

**Queries**

* `useQuery(["subjects", params], fetchSubjects, { keepPreviousData: true })`
* `useQuery(["subject", subjectId], fetchSubjectById, { enabled: !!subjectId })`
* `useQuery(["tasks", {subjectId, page, filter}], fetchTasksForSubject, { enabled: !!subjectId })`
* `useQuery(["task", taskId], fetchTaskById, { enabled: !!taskId })`

**Mutations**

* `useCreateSubject`: onSuccess -> `queryClient.invalidateQueries(["subjects"])`
* `useUpdateSubject`: onSuccess -> invalidate `["subjects"]` and `["subject", id]`
* `useCreateTask`: onSuccess -> invalidate `["tasks", {subjectId}]` OR optimistically update cache
* For list pages use `keepPreviousData` during paging and show loading skeletons.

**Optimistic updates**

* For create/delete on task lists, use optimistic updates:

  * `onMutate` -> snapshot old tasks, update cache with new item
  * `onError` -> rollback
  * `onSettled` -> invalidate to ensure server consistency

**Pagination**

* Use `useInfiniteQuery` for scroll/infinite lists or traditional paginated queries for table pages.

---

# Hooks folder — recommended contents & patterns

Create reusable query/mutation hooks (abstract details from components).

Example `useTasks.ts`:

```ts
import { useQuery } from "@tanstack/react-query";
import { fetchTasksForSubject } from "../api/tasks.api";

export function useTasks(subjectId: string | undefined, page: number, filter: string) {
  return useQuery(
    ["tasks", { subjectId, page, filter }],
    () => fetchTasksForSubject(subjectId!, page, filter),
    { enabled: !!subjectId, staleTime: 10 * 1000 }
  );
}
```

Example `useCreateTask.ts`:

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../api/tasks.api";

export function useCreateTask(subjectId: string) {
  const qc = useQueryClient();
  return useMutation(
    (taskData) => createTask({ subjectId, ...taskData }),
    {
      onMutate: async (newTask) => {
        await qc.cancelQueries(["tasks", { subjectId }]);
        const previous = qc.getQueryData(["tasks", { subjectId }]);
        qc.setQueryData(["tasks", { subjectId }], (old: any) => ({
          ...old,
          data: [newTask, ...(old?.data ?? [])],
        }));
        return { previous };
      },
      onError: (err, _, context) => qc.setQueryData(["tasks", { subjectId }], context.previous),
      onSettled: () => qc.invalidateQueries(["tasks", { subjectId }]),
    }
  );
}
```

---

# constants.tsx (single source of truth)

```ts
// constants.tsx
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
export const QUERY_KEYS = {
  subjects: (params = {}) => ["subjects", params] as const,
  subject: (id: string) => ["subject", id] as const,
  tasks: (subjectId: string, params = {}) => ["tasks", { subjectId, ...params }] as const,
  task: (id: string) => ["task", id] as const,
};
export const TOKEN_KEY = "app:token";
```

Use `QUERY_KEYS` helpers to keep query keys consistent.

---

# Forms: RHF + Zod integration patterns

* `zodResolver` at form-level.
* Use `defaultValues` pulled from query caches when editing.
* For nested routes, fetch subject with `useSubject(subjectId)` and pass to `TaskForm` as default values.
* After successful create/update: call `reset()` to clear form and optionally navigate.

**Example TaskForm create usage (inside `/subjects/:subjectId/tasks/create`)**

* Get `subjectId` from `useParams()`
* Setup RHF:

```ts
const { register, handleSubmit, reset } = useForm<TaskSchema>({ resolver: zodResolver(taskSchema), defaultValues: { subjectId } });
const createTask = useCreateTask(subjectId);
const onSubmit = (data) => createTask.mutate(data, { onSuccess: () => { reset(); navigate(`/subjects/${subjectId}`); }});
```

---

# UX details

* For create/edit, use modal with route driven state (so URL reflects view).
* Show inline validations and server error mapping to fields.
* Debounce inputs that trigger server lookups (e.g., slug check).
* Loading & skeletons for query pending states.
* Toast notifications for success/errors.
* Confirmations for destructive actions (delete).

---

# Security & production hardening

* Authorization on server for every endpoint.
* Rate limiting and input validation server-side.
* CSRF protection if using cookies.
* Use HTTPS and HSTS in production.
* Use content-security policy, sanitization for any rich text inputs.
* Log and monitor failed mutations and user activity.

---

# Observability & performance

* Add React Query Devtools during development.
* Use server metrics (Prometheus) and APM (Jaeger/NewRelic) for latency tracing.
* Load test endpoints (especially for SSE/WebSocket endpoints if you use them).

---

# Deliverable plan (how we’ll build it)

1. **Scaffold** project, routing, and react-query provider.
2. **Build Subject CRUD**:

   * API client → hooks (`useSubjects`, `useCreateSubject`, `useUpdateSubject`, `useDeleteSubject`).
   * Subject list page + table + create/edit modal using RHF+Zod.
3. **Build Tasks**:

   * Nested route under subject.
   * `useTasks`, `useTask`, `useCreateTask` (include optimistic updates).
   * Task form uses `subjectId` param for create.
4. **Polish**:

   * Add pagination/infinite listing, sorting, filters.
   * Add ID obfuscation approach (server-first).
   * Add error handling, toasts, form resets.
   * Add unit/integration tests for hooks and components.
5. **Hardening**:

   * Add E2E tests, CI pipeline, build optimizations, bundle splitting.
6. **Optional**:

   * Implement SSE for task notifications (e.g., new task created elsewhere).
   * Integrate feature flags / roles.

---

# Quick code snippets / examples (ready-to-use)

I included conceptual examples in hooks and constants above. When you’re ready, I’ll scaffold the exact code files for:

* `api/client.ts` (fetch wrapper with auth and error handling),
* `hooks/useSubjects.ts`, `hooks/useTasks.ts`,
* `components/forms/SubjectForm.tsx`, `TaskForm.tsx`,
* TanStack Router file-based route files under `app/routes`.

Say which part you want first — I’ll scaffold it end-to-end (route file + hook + form + API client). My recommendation: **start with Subject CRUD** (it’s the foundation). Want me to scaffold the Subject list page + create/edit modal next?
