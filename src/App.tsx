import Navbar from "./Components/Navbar";
import SideBar from "./Components/SideBar/SideBar";

function App() {
  return (
    <div className="w-full h-screen bg-white">
      <div className="w-full flex flex-col h-full">
        <Navbar />
        <div className="w-full h-full flex justify-stretch">
          <div className="">
            <SideBar />
          </div>
          <div className="w-full bg-[var(--main-white-color)]"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
