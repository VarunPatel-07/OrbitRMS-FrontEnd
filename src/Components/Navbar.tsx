import { PiDotsNineBold } from "react-icons/pi";
import OrbitRMSLogo from "../assets/Images/OrbitRMS-Final-Logo-transperent.png";

function Navbar() {
  return (
    <div className="w-full h-14 flex items-center justify-between border-b border-b-slate-300">
      <div className="h-full flex w-fit gap-3">
        <button className="w-[57px] h-full border-r border-r-slate-300 flex items-center justify-center">
          <PiDotsNineBold className="text-black w-7 h-7" />
        </button>
        <img src={OrbitRMSLogo} width={150} className="w-36" alt="" />
      </div>
      <div></div>
    </div>
  );
}

export default Navbar;
