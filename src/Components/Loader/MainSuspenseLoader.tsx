import { AiOutlineLoading3Quarters } from "react-icons/ai";
import OrbitRMSTransparentLogo from "../../assets/Images/OrbitRMS-Final-Logo-transperent.png";
function MainSuspenseLoader() {
  return (
    <div className="w-screen h-screen bg-slate-50 backdrop-blur-sm fixed top-0 left-0">
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="flex flex-col items-center justify-end gap-28">
          <img src={OrbitRMSTransparentLogo} className="w-80 animate-pulse" alt="" />
        </div>
        <div className="absolute bottom-0 pb-20">
          <AiOutlineLoading3Quarters className="animate-spin text-3xl text-slate-950 font-bold" />
        </div>
      </div>
    </div>
  );
}

export default MainSuspenseLoader;
