import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getDataFromLocalStorage } from "./HelperFunctions";

function ProtectedRoute({ element }: { element: React.ReactElement }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!getDataFromLocalStorage("authenticationToken");
  });

  useEffect(() => {
    const token = getDataFromLocalStorage("authenticationToken");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return isAuthenticated ? element : <Navigate to="/auth/login" />;
}

export default ProtectedRoute;
