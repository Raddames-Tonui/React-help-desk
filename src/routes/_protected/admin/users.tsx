import UsersPage from '@/pages/UsersPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/users')({
  component: UsersPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: Number(search.page) || 1,
      pageSize: Number(search.pageSize) || 10,
      sortBy: (search.sortBy as string) ?? '',
      role: (search.role as string) ?? '',
      status: (search.status as string) ?? '',
    }
  }

})

