import type { ReactNode } from "react";
import Layout from "./layout/Layout";

import Client from "./pages/Client";
import Vendor from "./pages/Vendor";
import Home from "./pages/Home";
import Odata from "./pages/Odata";
import Vendor2 from "./pages/Vendor2";

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
      { path: "/vendor/submission", element: <Vendor2 /> },
      { path: "/odata", element: <Odata/> },
    ],
  },
];
