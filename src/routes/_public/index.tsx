import { createFileRoute, Link } from '@tanstack/react-router'


export const Route = createFileRoute('/_public/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Link to="/auth/login">Go to Login</Link>
    </div>
  )
}
