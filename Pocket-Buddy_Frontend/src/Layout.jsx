// Layout.jsx manages page layout and styling.


import React, { useEffect, useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AppRoutes from "./AppRoutes"; // Routes are now in a separate file
//import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported if needed

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

const Layout = () => {
  const location = useLocation();
  const authPages = useMemo(() => ["/login", "/signup"], []);

  useEffect(() => {
    document.body.className = authPages.includes(location.pathname)
      ? ""
      : "layout-fixed sidebar-expand-lg bg-body-tertiary sidebar-open app-loaded";
  }, [location.pathname, authPages]);

  return (
    <div className={authPages.includes(location.pathname) ? "" : "app-wrapper"}>
      <main className="mt-0">
        <AppRoutes />
        <ToastContainer />
      </main>
    </div>
  );
};

export default Layout;
