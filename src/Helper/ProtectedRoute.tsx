import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ element }: { element: React.ReactNode }) {
  const isAuthenticated = true; // Replace with actual authentication logic

  return isAuthenticated ? element : <Navigate to="/auth/login" />;
}

export default ProtectedRoute;
