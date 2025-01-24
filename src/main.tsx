import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./Auth/SignIn";
import ErrorFallBack from "./common/ErrorFallBack";
import SignUp from "./Auth/SignUp";
import App from "./App";
import "./css/rootColors.css";
import Organizations from "./Organization/Organizations";
import "react-tooltip/dist/react-tooltip.css";
import ProtectedRoute from "./Helper/ProtectedRoute";
import RegisterOrganizationForm from "./Organization/RegisterOrganizationForm";
import "./css/font.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/pages/organizations" element={<ProtectedRoute element={<Organizations />} />} />
        <Route
          path="/pages/register-organization"
          element={<ProtectedRoute element={<RegisterOrganizationForm />} />}
        />
        <Route path="/*" element={<ProtectedRoute element={<App />} />} />
        <Route path="*" element={<ErrorFallBack />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
