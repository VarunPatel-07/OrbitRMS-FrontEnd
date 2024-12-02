import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import SignUp from "./Auth/SignUp";
import SideBar from "./Components/SideBar/SideBar";
// import Login from "./Auth/Login";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <Login /> */}
    {/* <SignUp /> */}
    <SideBar />
  </StrictMode>
);
