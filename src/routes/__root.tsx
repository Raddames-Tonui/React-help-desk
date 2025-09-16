

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
})
