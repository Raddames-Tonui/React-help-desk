import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  component: RouteComponent,
})

function RouteComponent() {
  return
  <div
    className='body-wrapper'
    style={
      "--sidebar-width" : isSidebarOpen ? "240px" : "48px",
    } as React.CSSProperties
  >

  </div>
}
