import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Auth/Login";
import ErrorFallBack from "./Components/common/ErrorFallBack";
import SignUp from "./Auth/SignUp";
import App from "./App";
import "./rootColors.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<Login />} errorElement={<ErrorFallBack />} />
        <Route path="/auth/signup" element={<SignUp />} errorElement={<ErrorFallBack />} />
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
