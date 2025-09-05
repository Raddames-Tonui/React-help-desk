import type { ReactNode } from "react";
import Layout from "./layout/Layout";

import Client from "./pages/Client";
import Vendor from "./pages/Vendor";
import Home from "./pages/Home";

export interface AppRoute {
  path?: string;
  element: ReactNode;
  children?: AppRoute[];
}

export const routes: AppRoute[] = [
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/client", element: <Client/> },
      { path: "/vendor", element: <Vendor /> },
    ],
  },
];
