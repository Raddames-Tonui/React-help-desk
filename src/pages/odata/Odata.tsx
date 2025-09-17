import React from 'react'
import { usePeople, Person } from './usePeople'
import { Route } from '../../routes/_protected/pages/odata/index'
import type { ColumnProps } from '../../components/table/DataTable'
import { DataTable } from '../../components/table/DataTable'

const Odata: React.FC = () => {
  const searchParams = Route.useSearch()
  const navigate = Route.useNavigate()

  const page = searchParams.page ?? 1
  const pageSize = searchParams.pageSize ?? 5
  const sortBy = searchParams.sortBy ?? ''
  const filter = searchParams.filter ?? ''
  const freeSearch = searchParams.search ?? ''

  const { data, error, isLoading } = usePeople(
    page,
    pageSize,
    sortBy,
    filter,
    freeSearch
  )

  const handlePageChange = (newPage: number) => {
    navigate({
      search: { page: newPage, pageSize, sortBy, filter, search: freeSearch }
    })
  }

  if (isLoading) return <div className="p-4">Loading people...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>

  const columns: ColumnProps<Person>[] = [
    { id: 'UserName', caption: 'Username', size: 100, align: 'left', isSortable: true, isFilterable: true },
    { id: 'FirstName', caption: 'First Name', size: 100, isSortable: true, isFilterable: true },
    { id: 'LastName', caption: 'Last Name', size: 150, isSortable: true, isFilterable: true },
    {
      id: 'Gender',
      caption: 'Gender',
      size: 100,
      isSortable: true,
      isFilterable: true,
      renderCell: (value) => (
        <span
          style={{
            color: value === 'Male' ? 'red' : value === 'Female' ? 'blue' : 'inherit',
            fontWeight: 'bold'
          }}
        >
          {value}
        </span>
      )
    },
    {
      id: 'Emails',
      caption: 'Emails',
      size: 250,
      renderCell: (value) => (value ? value.join(', ') : '—'),
      hide: true,
      isFilterable: true,
    },
    {
      id: 'AddressInfo',
      caption: 'City',
      size: 150,
      renderCell: (row) => row.AddressInfo?.[0]?.City?.Name ?? '—',
      hide: true,
      isFilterable: true,
    },
  ]

  return (
    <div>
      <div className="page-header">
        <h3>OData People</h3>
      </div>

      <DataTable<Person>
        columns={columns}
        data={data?.value ?? []}
        pagination={{
          page,
          pageSize,
          total: data?.['@odata.count'] ?? 0,
          onPageChange: handlePageChange
        }}
      />
    </div>
  )
}

export default Odata
