// _protected/pages/odata/index.tsx
import React, { useState } from 'react'
import { usePeople, Person } from './usePeople'
import { Route } from '../../routes/_protected/pages/odata/index'
import type { ColumnProps } from '../../components/Table'
import Table from '../../components/Table'
import Modalsort from '../../components/Modalsort'
import ModalFilter from '../../components/Modalfilter'

const Odata: React.FC = () => {
  const searchParams = Route.useSearch()
  const navigate = Route.useNavigate()

  const [isFilterModalOpen, setFilterModalOpen] = useState(false)
  const [isSortModalOpen, setSortModalOpen] = useState(false)

  const page = searchParams.page ?? 1
  const pageSize = searchParams.pageSize ?? 5
  const sortBy = searchParams.sortBy ?? ''
  const filter = searchParams.filter ?? ''   // 🟢 pass this into ModalFilter
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

  const handlePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate({
      search: { page: 1, pageSize: Number(e.target.value), sortBy, filter, search: freeSearch }
    })
  }

  const handleSortApply = (sortString: string) => {
    navigate({
      search: { page: 1, pageSize, sortBy: sortString, filter, search: freeSearch }
    })
  }

  const handleFilterApply = (filterString: string) => {
    navigate({
      search: { page: 1, pageSize, sortBy, filter: filterString, search: freeSearch }
    })
  }

  if (isLoading) return <div className="p-4">Loading people...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>

  const columns: ColumnProps<Person>[] = [
    { id: 'UserName', caption: 'Username', size: 100, align: 'left', isSortable: true, isFilterable: true },
    { id: 'FirstName', caption: 'First Name', size: 100, isSortable: true, isFilterable: true },
    { id: 'LastName', caption: 'Last Name', size: 150, isSortable: true, isFilterable: true },
    { id: 'Gender', caption: 'Gender', size: 100, isSortable: true, isFilterable: true },
    {
      id: 'Emails',
      caption: 'Emails',
      size: 250,
      render: (row, value) => (value ? value.join(', ') : '—'),
      hide: true,
      isFilterable: true,
    },
    {
      id: 'AddressInfo',
      caption: 'City',
      size: 150,
      render: (row) => row.AddressInfo?.[0]?.City?.Name ?? '—',
      hide: true,
      isFilterable: true,
    },
  ]

  return (
    <div>
      <div className="page-header">
        <h3>OData People</h3>
        <div className="page-utils-buttons">
          <input className="button-sec" placeholder="Search..." type="search" />
          <button className="button" onClick={() => setFilterModalOpen(true)}>Filter</button>
          <button className="button" onClick={() => setSortModalOpen(true)}>Sort</button>
        </div>
      </div>

      <Table<Person> columns={columns} data={data?.value ?? []} />

      {/* Sorting modal */}
      <Modalsort
        isOpen={isSortModalOpen}
        onClose={() => setSortModalOpen(false)}
        columns={columns}
        onApply={handleSortApply}
        initialSort={sortBy}
      />

      {/* Filtering modal */}
      <ModalFilter
        isOpen={isFilterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        columns={columns}
        onApply={handleFilterApply}
        initialFilter={filter}
      />

      <div className="pagination">
        <button
          className="pagination-btn prev-btn"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Prev
        </button>
        <span className="page-no">
          Page {page}{' '}
          {data?.['@odata.count']
            ? `of ${Math.ceil(data['@odata.count'] / pageSize)}`
            : ''}
        </span>
        <button
          className="pagination-btn next-btn"
          disabled={
            data?.['@odata.count']
              ? page >= Math.ceil(data['@odata.count'] / pageSize)
              : false
          }
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Odata
