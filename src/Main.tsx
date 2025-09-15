
import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client"
import { router } from "./router";
import React from "react";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);