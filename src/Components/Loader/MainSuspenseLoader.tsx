import { AiOutlineLoading3Quarters } from "react-icons/ai";
import OrbitRMSTransparentLogo from "../../assets/Images/OrbitRMS-Final-Logo-transperent.png";
import { useState, useEffect } from "react";

function MainSuspenseLoader({ loading }: { loading: boolean }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let timer = null;
    if (!loading) {
      timer = setTimeout(() => setFadeOut(true), 500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading]);

  return (
    <div
      className={`w-screen h-screen bg-slate-50 backdrop-blur-sm fixed top-0 left-0 z-20 ${fadeOut ? "fade-out" : ""}`}>
      <div className="w-full h-full flex items-center justify-center relative">
        <div className="flex flex-col items-center justify-end gap-28">
          <img src={OrbitRMSTransparentLogo} className="w-80 animate-pulse" alt="Logo" />
        </div>
        {loading && (
          <div className="absolute bottom-0 pb-20">
            <AiOutlineLoading3Quarters className="animate-spin text-3xl text-slate-950 font-bold" />
          </div>
        )}
      </div>
    </div>
  );
}

export default MainSuspenseLoader;
