# TanStack Query + React Hook Form + Zod: Comprehensive Guide

👉 [View Live App](https://react-tanstack-query-main.netlify.app/)

This README covers:

* **TanStack Query** (useQuery & useMutation)
* **React Hook Form**
* **Zod validation**
* **Invalidation and refetching**
* **Best practices, tips, and advanced usage**

---

## 1. TanStack Query (React Query)

TanStack Query is a powerful data-fetching and caching library for React.

### **useQuery**

Used to fetch and cache server data.

```ts
import { useQuery } from '@tanstack/react-query';

function useSubjects(page: number, pageSize: number) {
  return useQuery({
    queryKey: ['subjects', page, pageSize],
    queryFn: () => fetch(`/api/admin/subjects?page=${page}&pageSize=${pageSize}`).then(res => res.json()),
    staleTime: 1000 * 60, // 1 minute cache
    keepPreviousData: true, // smooth pagination
  });
}
```

* `queryKey`: Unique identifier for caching.
* `queryFn`: Function that fetches data.
* `staleTime`: Determines how long data is fresh.
* `keepPreviousData`: Useful for pagination.

#### **Example Usage**

```tsx
const { data, isLoading, error } = useSubjects(1, 10);
```

---

### **useMutation**

Used to modify server data (POST, PUT, DELETE).

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

const createSubjectMutation = useMutation({
  mutationFn: (newSubject) => fetch('/api/admin/subjects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${TOKEN}` },
    body: JSON.stringify(newSubject),
  }).then(res => res.json()),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['subjects'] });
  }
});
```

* `mutationFn`: Function performing API action.
* `onSuccess`: Trigger actions after mutation succeeds (like cache invalidation).

---

### **Invalidation & Refetching**

After mutations (create/update/delete), React Query **does not automatically refresh cached queries**. `invalidateQueries` triggers refetch:

```ts
queryClient.invalidateQueries({ queryKey: ['subjects'] });
```

* Marks cache stale.
* Automatically refetches query in background.
* Updates all components using that query.

**Optional Optimistic Update:**

```ts
onMutate: async (newData) => {
  await queryClient.cancelQueries(['subjects']);
  const previous = queryClient.getQueryData(['subjects']);
  queryClient.setQueryData(['subjects'], (old) => [...old, newData]);
  return { previous };
},
onError: (err, variables, context) => {
  queryClient.setQueryData(['subjects'], context.previous);
},
onSettled: () => {
  queryClient.invalidateQueries(['subjects']);
}
```

* UI updates immediately, rollback if API fails.

---

## 2. React Hook Form

A performant library for building forms in React.

### **Basic usage**

```tsx
import { useForm } from 'react-hook-form';

const { register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues: { name: '', description: '' } });

const onSubmit = (data) => console.log(data);

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('name')} placeholder='Name' />
  {errors.name && <p>{errors.name.message}</p>}
  <button type='submit'>Submit</button>
</form>
```

* `register`: binds input to form state.
* `handleSubmit`: wraps your submit function.
* `formState.errors`: shows validation errors.
* `reset()`: clears form.

---

## 3. Zod for Validation

Zod is a TypeScript-first schema validation library.

### **Defining Schema**

```ts
import { z } from 'zod';

const subjectSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;
```

* Can integrate with React Hook Form via `zodResolver`:

```ts
import { zodResolver } from '@hookform/resolvers/zod';
const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(subjectSchema) });
```

* Ensures type-safe validation at runtime.

---

## 4. Combining React Query, RHF, Zod

```tsx
<SubjectForm subject={subject} onClose={closeModal} />
```

* RHF handles form state and validation (with Zod).
* `useMutation` handles create/update/delete.
* `onSuccess` invalidates queries to refresh UI.
* Optionally show success/error with `react-hot-toast`:

```ts
import toast from 'react-hot-toast';

const mutation = useMutation({
  mutationFn: createOrUpdateFn,
  onSuccess: () => {
    queryClient.invalidateQueries(['subjects']);
    toast.success('Subject saved successfully!');
    onClose();
  },
  onError: (err: any) => toast.error(err.message),
});
```

---

## 5. Summary / Best Practices

1. **Use useQuery for fetching and caching**
2. **Use useMutation for modifications**
3. **Always invalidate queries** after mutations to keep UI in sync
4. **Use React Hook Form for managing forms**
5. **Integrate Zod for schema validation**
6. **React-hot-toast** is perfect for user feedback
7. **Optimistic updates** improve UX
8. Use **queryKey arrays** to differentiate queries (pagination, filters)

---

**Flow Recap:**

```
User Action (Edit/Create/Delete)
       |
   useMutation
       |
   API Call (POST/PUT/DELETE)
       |
   onSuccess
       |
queryClient.invalidateQueries(['subjects'])
       |
useQuery refetches data
       |
UI refreshes automatically
       |
Toast shows success/error
```

---

This setup gives you **type-safe forms**, **robust server interaction**, **automatic caching**, and **instant user feedback** — all working together seamlessly.

---

Do you want me to also **add the full SubjectActions + SubjectForm combined code with react-hot-toast notifications** so you can drop it directly into your project?
