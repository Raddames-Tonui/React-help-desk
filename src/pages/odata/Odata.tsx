// _protected/pages/odata/index.tsx
import React from 'react'
import { usePeople } from './usePeople'
import { Route } from '../../routes/_protected/pages/odata/index'

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
    navigate({ search: { page: newPage, pageSize, sortBy, filter, search: freeSearch } })
  }

  const handleSort = (column: string) => {
    let newSort: string
    if (!sortBy.startsWith(column)) {
      newSort = `${column} asc`
    } else if (sortBy.endsWith('asc')) {
      newSort = `${column} desc`
    } else {
      newSort = ''
    }
    navigate({ search: { page: 1, pageSize, sortBy: newSort, filter, search: freeSearch } })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    navigate({ search: { page: 1, pageSize, sortBy, filter, search: e.target.value } })
  }

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value ? `Gender eq '${e.target.value}'` : ''
    navigate({ search: { page: 1, pageSize, sortBy, filter: newFilter, search: freeSearch } })
  }

  if (isLoading) return <div className="p-4">Loading people...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">OData People (Pagination + Sorting + Search + Filters)</h1>

      {/* 🔍 Search + Filter Controls */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={freeSearch}
          onChange={handleSearch}
          className="border px-3 py-1 rounded"
        />
        <select value={filter.includes('Gender') ? filter.split("'")[1] : ''} onChange={handleFilter} className="border px-3 py-1 rounded">
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      {/* Table */}
      <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            {['UserName', 'FirstName', 'LastName', 'Gender'].map((col) => (
              <th
                key={col}
                className="border px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort(col)}
              >
                {col}
                {sortBy.startsWith(col) && (
                  <span className="ml-1">
                    {sortBy.endsWith('asc') ? '⬆️' : '⬇️'}
                  </span>
                )}
              </th>
            ))}
            <th className="border px-4 py-2">Emails</th>
            <th className="border px-4 py-2">City</th>
          </tr>
        </thead>
        <tbody>
          {data?.value.map((person) => (
            <tr key={person.UserName} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{person.UserName}</td>
              <td className="border px-4 py-2">{person.FirstName}</td>
              <td className="border px-4 py-2">{person.LastName}</td>
              <td className="border px-4 py-2">{person.Gender}</td>
              <td className="border px-4 py-2">{person.Emails?.join(', ')}</td>
              <td className="border px-4 py-2">
                {person.AddressInfo[0]?.City?.Name || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex items-center gap-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Prev
        </button>
        <span>
          Page {page}{' '}
          {data?.['@odata.count'] ? `of ${Math.ceil(data['@odata.count'] / pageSize)}` : ''}
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={
            data?.['@odata.count'] ? page >= Math.ceil(data['@odata.count'] / pageSize) : false
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
