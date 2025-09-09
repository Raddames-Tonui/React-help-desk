import type { ReactNode } from "react";
import Layout from "./layout/Layout";

import Client from "./pages/Client";
import Vendor from "./pages/Vendor";
import Home from "./pages/Home";
import Odata from "./pages/Odata";

export interface AppRoute {
  path?: string;
  element: ReactNode;
  children?: AppRoute[];
}

export const routes: AppRoute[] = [
  {
    path: "/", element: <Home />
  },
  {
    element: <Layout />,
    children: [
      { path: "/client", element: <Client/> },
      { path: "/vendor", element: <Vendor /> },
      { path: "/odata", element: <Odata/> },
    ],
  },
];
