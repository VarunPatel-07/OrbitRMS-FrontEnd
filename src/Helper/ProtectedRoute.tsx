import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = true; // Replace with actual authentication logic

  return isAuthenticated ? children : <Navigate to="/auth/login" />;
}

export default ProtectedRoute;
