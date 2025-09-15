// import { createRootRoute } from "@tanstack/react-router";
// import "@css/global.css"

// export const Route = createRootRoute();



import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import "@css/global.css"


export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),

  errorComponent: ({ error }) => (
    <div style={{ padding: "1rem", color: "red" }}>
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
    </div>
  ),

  pendingComponent: () => (
    <div style={{ padding: "1rem" }}>
      <p>Loading...</p>
    </div>
  ),
})
