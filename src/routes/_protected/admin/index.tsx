import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/_protected/admin/')({
  component: RouteComponent,
})

function RouteComponent() {

  return <div>
    <h2>Welcome to Admins Dashboard</h2>

  </div>
}
