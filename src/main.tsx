import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./Auth/SignIn";
import ErrorFallBack from "./common/ErrorFallBack";
import SignUp from "./Auth/SignUp";
import App from "./App";
import "./css/rootColors.css";
import "react-tooltip/dist/react-tooltip.css";
import ProtectedRoute from "./Helper/ProtectedRoute";
import "./css/font.css";
import ForgotPassword from "./Auth/ForgotPassword";
import CreateResetPassword from "./Auth/CreateResetPassword";
import Notification from "./common/Notification/Notification";
import { NotificationContextApiProvider } from "./Context/Notification/NotificationContextApi";
import VerifyEmail from "./Pages/VerifyEmail";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NotificationContextApiProvider>
      <BrowserRouter>
        <Routes>
          {/* All The Routes That Are Not Protected */}

          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/auth/sign-up" element={<SignUp />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/create-password" element={<CreateResetPassword />} />
          <Route path="/auth/reset-password" element={<CreateResetPassword />} />
          <Route path="/verification/verify-email" element={<VerifyEmail />} />

          {/* all The Protected Routes are Defined Blow */}

          <Route path="/*" element={<ProtectedRoute element={<App />} />} />

          {/* Error FallBack Rout */}

          <Route path="*" element={<ErrorFallBack />} />
        </Routes>
      </BrowserRouter>
      <Notification />
    </NotificationContextApiProvider>
  </StrictMode>
);
