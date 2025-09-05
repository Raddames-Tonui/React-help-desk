import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import type { AppRoute } from "./routes";
import { routes} from "./routes";

const renderRoutes = (routes: AppRoute[]) =>
  routes.map((route, index) => (
    <Route key={index} path={route.path} element={route.element}>
      {route.children && renderRoutes(route.children)}
    </Route>
  ));

const App = (): React.JSX.Element => {
  return (
    <Router>
      <Routes>{renderRoutes(routes)}</Routes>
    </Router>
  );
};

export default App;
