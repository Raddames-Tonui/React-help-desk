// _protected/pages/odata/index.tsx
import React from 'react'
import { usePeople } from './usePeople'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { Route } from '../../routes/_protected/pages/odata/index'


const Odata: React.FC = () => {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const page = search.page ?? 1
  const pageSize = search.pageSize ?? 5

  const { data, error, isLoading } = usePeople(page, pageSize)

  const handlePageChange = (newPage: number) => {
    navigate({
      search: { page: newPage, pageSize }, 
    })
  }

  if (isLoading) return <div className="p-4">Loading people...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">OData People (Pagination)</h1>

      <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">UserName</th>
            <th className="border px-4 py-2">First Name</th>
            <th className="border px-4 py-2">Last Name</th>
            <th className="border px-4 py-2">Gender</th>
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

      {/*  Pagination Controls */}
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
