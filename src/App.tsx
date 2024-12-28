import { Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import SideBar from "./Components/SideBar/SideBar";
import ProtectedRoute from "./Helper/ProtectedRoute";
import ClientInquiry from "./Pages/ClientInquiry/ClientInquiry";
import ErrorFallBack from "./common/ErrorFallBack";

function App() {
  return (
    <div className="w-full h-screen bg-white">
      <div className="w-full flex flex-col h-full">
        <Navbar />
        <div className="w-full h-full flex justify-stretch">
          <div className="">
            <SideBar />
          </div>
          <div className="w-full bg-[var(--main-white-color)]">
            <Routes>
              <Route path="/client-inquiry" element={<ProtectedRoute element={<ClientInquiry />} />} />
              <Route path="*" element={<ErrorFallBack />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
