import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent duplicate alerts
    if (!sessionStorage.getItem("unauthorized_alert")) {
      alert("You are not authorized!");
      sessionStorage.setItem("unauthorized_alert", "true"); // ✅ Ensures alert only shows once
    }
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1); // ✅ Go back if history exists
    } else {
      navigate("/", { replace: true }); // ✅ Redirect to home if no history
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">Access Denied!</h1>
      <p className="text-lg mt-2 text-gray-700">
        You do not have permission to view this page.
      </p>
      <button
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        onClick={handleGoBack}
      >
        Go Back
      </button>
    </div>
  );
};

export default Unauthorized;
