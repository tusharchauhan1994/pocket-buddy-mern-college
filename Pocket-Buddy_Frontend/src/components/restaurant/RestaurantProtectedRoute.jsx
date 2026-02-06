import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const RestaurantProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const alertShown = useRef(false);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "Restaurant") {
      sessionStorage.setItem("lastValidPage", window.location.pathname);

      if (!alertShown.current) {
        alert("Access Denied! Only Restaurant Owners can access this page.");
        alertShown.current = true;
      }

      navigate("/unauthorized", { replace: true });
    }
  }, [navigate]);

  return <>{children}</>;
};

export default RestaurantProtectedRoute;
