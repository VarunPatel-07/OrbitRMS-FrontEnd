import TeamMembersImages from "../assets/SVG-Images/collaborations-illustration-image.png";
import OrbitRMS_Logo from "../assets/Images/OrbitRMS-Final-Logo-transperent.png";
import moduleName from "../assets/SVG-Images/OJO4YQ0-removebg-preview.png";
import { GoOrganization } from "react-icons/go";
import { useState } from "react";
import HelmetSeo from "../Helper/HelmetSeo";
import { Link } from "react-router-dom";

function Organizations() {
  const [currentSelectedSlider, setCurrentSelectedSlider] = useState("Register");

  const handleTopNavigationSliderButton = (btnName: string) => {
    // Implement your button logic here
    setCurrentSelectedSlider(btnName);
    console.log(`${btnName} button clicked!`);
  };

  return (
    <>
      <HelmetSeo Title="Organizations | OrbitRMS" />
      <div className="w-full h-screen bg-white px-12 py-12">
        <div className="shadow-2xl w-full h-full bg-[var(--main-white-color)] rounded-2xl grid grid-cols-2 items-stretch justify-center overflow-hidden">
          <div className="bg-[var(--main-white-color)] grid grid-cols-1 items-end justify-end px-6 relative">
            <img src={OrbitRMS_Logo} className="w-48 mx-auto absolute top-7 left-1/2 -translate-x-1/2" alt="" />
            <img
              src={TeamMembersImages}
              className="w-full mx-auto absolute -bottom-4 left-1/2 -translate-x-1/2"
              alt=""
            />
          </div>

          <div className="bg-gradient-to-r from-[#fb923c] to-[#f87171] animate-rotateGradient flex flex-col items-center justify-between px-6 py-20 relative gap-10 overflow-hidden">
            <div className="grid grid-cols-1 gap-y-16 items-start justify-start relative z-10">
              <div className="max-w-[90%] mx-auto rounded-md overflow-hidden border-[1.2px] border-[var(--main-blue-color)] p-1">
                <div className="grid grid-cols-2 relative gap-2">
                  <span
                    className={`absolute w-1/2 bg-[var(--main-white-color)] top-0 h-full rounded-md transition-all duration-500 left-0 ${
                      currentSelectedSlider === "Register" ? "translate-x-0" : "translate-x-full"
                    }`}></span>
                  <button
                    className={`text-[var(--main-blue-color)] relative z-10 capitalize text-base font-sans font-semibold px-4 py-2.5 bg-transparent ${
                      currentSelectedSlider === "Register" ? "" : "hover:bg-[rgba(255,255,255,0.6)] rounded-lg"
                    }`}
                    onClick={() => handleTopNavigationSliderButton("Register")}>
                    Register Your Organization
                  </button>
                  <button
                    className={`text-[var(--main-blue-color)] relative z-10 capitalize text-base font-sans font-semibold px-4 py-2.5 bg-transparent ${
                      currentSelectedSlider === "Join" ? "" : "hover:bg-[rgba(255,255,255,0.6)] rounded-lg"
                    }`}
                    onClick={() => handleTopNavigationSliderButton("Join")}>
                    Join an Organization
                  </button>
                </div>
              </div>
              <div
                className={`flex transition-all duration-500 ${
                  currentSelectedSlider === "Register" ? "translate-x-0" : "-translate-x-full"
                }`}>
                <div className="min-w-full w-full">
                  <div className="flex flex-col gap-8 relative z-10">
                    <h2 className="font-serif text-white text-3xl text-center text-pretty font-semibold">
                      Streamline Your Operations with
                      <span className="text-[#000000] text-[32px] font-semibold"> OrbitRMS</span>
                    </h2>
                    <p className="text-white text-balance font-serif text-lg text-center max-w-[90%] mx-auto">
                      Register with OrbitRMS to simplify resource management, optimize workflows, and enhance
                      operational efficiency. Stay organized and focus on what matters most!
                    </p>
                  </div>
                </div>
                <div className="min-w-full w-full">
                  <div className="flex flex-col gap-8 relative z-10">
                    <h2 className="font-serif text-white text-3xl text-center text-pretty font-semibold">
                      Streamline Your Operations with
                      <span className="text-[#000000] text-[32px] font-semibold"> OrbitRMS</span>
                    </h2>
                    <p className="text-white text-balance font-serif text-lg text-center max-w-[90%] mx-auto">
                      Join OrbitRMS to streamline your organization's resource management, optimize team workflows, and
                      boost overall operational efficiency. Stay organized, collaborate effectively, and focus on
                      achieving your goals!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`flex transition-all duration-500 relative z-10 ${
                currentSelectedSlider === "Register" ? "translate-x-0" : "-translate-x-full"
              }`}>
              <div className="min-w-full w-full">
                <Link
                  className="bg-[var(--main-blue-color)] w-fit mx-auto px-10 py-4 rounded-full font-serif text-base font-bold text-white flex items-center justify-center gap-2 relative overflow-hidden group z-10"
                  to={"/pages/register-organization"}>
                  <span className="inline-block relative z-10 group-hover:text-black transition-all duration-500">
                    <GoOrganization className="w-5 h-5" />
                  </span>
                  <span className="inline-block relative z-10 group-hover:text-black transition-all duration-500">
                    Register Your Organization
                  </span>
                  <span className="absolute w-full h-full rounded-full bg-white -translate-x-full group-hover:translate-x-0 transition-all duration-500"></span>
                </Link>
              </div>
              <div className="min-w-full w-full">
                <button className="bg-[var(--main-blue-color)] w-fit mx-auto px-10 py-4 rounded-full font-serif text-base font-bold text-white flex items-center justify-center gap-2 relative overflow-hidden group z-10">
                  <span className="inline-block relative z-10 group-hover:text-black transition-all duration-500">
                    <GoOrganization className="w-5 h-5" />
                  </span>
                  <span className="inline-block relative z-10 group-hover:text-black transition-all duration-500">
                    Join an Organization
                  </span>
                  <span className="absolute w-full h-full rounded-full bg-white -translate-x-full group-hover:translate-x-0 transition-all duration-500"></span>
                </button>
              </div>
            </div>
            <img
              src={moduleName}
              alt="laptop-with-social-icon"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 w-full  z-0"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Organizations;
