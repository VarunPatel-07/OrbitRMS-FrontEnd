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
import ForgotPassword from "./Auth/ForgotPassword";
import CreateResetPassword from "./Auth/CreateResetPassword";
import Notification from "./common/Notification/Notification";
import { NotificationContextApiProvider } from "./common/Notification/context/NotificationContextApi";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NotificationContextApiProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/auth/sign-up" element={<SignUp />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/create-password" element={<CreateResetPassword />} />
          <Route path="/auth/reset-password" element={<CreateResetPassword />} />
          <Route path="/pages/organizations" element={<ProtectedRoute element={<Organizations />} />} />
          <Route
            path="/pages/register-organization"
            element={<ProtectedRoute element={<RegisterOrganizationForm />} />}
          />
          <Route path="/*" element={<ProtectedRoute element={<App />} />} />
          <Route path="*" element={<ErrorFallBack />} />
        </Routes>
      </BrowserRouter>
      <Notification />
    </NotificationContextApiProvider>
  </StrictMode>
);
