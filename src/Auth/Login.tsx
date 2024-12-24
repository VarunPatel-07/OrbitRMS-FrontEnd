import Illustration from "../assets/Images/a-minimalistic-illustration-of-a-professional-woma-qB-EvpaUTCW_7VPIzQCwAA-liCsDCsyRx6jUnjJ69VBsw.jpeg";
import OrbitRMS from "../assets/Images/OrbitRMS-White-Transperent-Logo.png";
import Input from "../Components/common/Input";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

import "./auth.css";
import HelmetSeo from "../Helper/HelmetSeo";
import { useState } from "react";
import { isValidEmail } from "../Helper/HelperFunctions";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("" as string);
  const [password, setPassword] = useState("" as string);
  const [showError, setShowError] = useState(false as boolean);

  const handelLoginSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    console.log("clicked");
    if (email.length < 1 || password.length < 4) {
      setShowError(true);
    } else {
      if (!isValidEmail(email)) {
        setShowError(true);
      }
    }
  };

  return (
    <>
      <HelmetSeo
        Title="Login | OrbitRMS"
        Content="logIn To OrbitRMS to simplify your work, manage everything in one place, and stay ahead with ease!"
      />
      <div className="w-full h-screen">
        <div className="w-full h-full flex items-center justify-center bg-white lg:p-4 xl:p-7 overflow-hidden">
          <div className="w-full h-full flex items-stretch justify-center rounded-3xl shadow-2xl overflow-hidden">
            <div className="w-[40%] h-full bg-[var(--main-blue-color)] flex flex-col items-center justify-between">
              <div className="w-full flex items-center justify-center py-3">
                <img src={OrbitRMS} alt="" className="w-48" />
              </div>
              <img src={Illustration} alt="A Woman Setting On The Computer" className="w-full h-fit object-cover" />
            </div>
            <div className="w-[60%] bg-[var(--main-white-color)] relative">
              <div className="w-full h-full px-4 pt-4 pb-8 flex flex-col justify-between">
                <div className="w-full px-3 py-3  max-w-[400px] me-auto">
                  <h1 className="text-[#242c40] text-4xl font-serif text-nowrap text-start">
                    logIn To <span className="font-semibold">Orbit</span>RMS
                  </h1>
                  <p className="font-serif text-[#242c40] font-normal text-base capitalize pt-2">
                    to simplify your work, manage everything in one place, and stay ahead with ease!
                  </p>
                </div>
                <div className="w-full flex items-center justify-center">
                  <div className="login-form min-w-[60%] bg-[var(--main-white-color)2f] backdrop-blur-sm py-14 px-14 relative z-10 flex items-center justify-center rounded-lg border border-[#242c40]">
                    <div className="grid grid-cols-1 w-full gap-4 ">
                      <div className="w-full">
                        <Input
                          ClassName="border-[1.5px] border-slate-500 text-black rounded-2xl bg-slate-50"
                          placeHolder="Email"
                          Type="email"
                          value={email}
                          setValue={setEmail}
                          placeholderColor="text-gray-500"
                          showError={showError} // Pass the showError state
                          errorMessage={
                            email.length < 1
                              ? "This field is required"
                              : !isValidEmail(email)
                              ? "Invalid email address"
                              : ""
                          }
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          ClassName="border-[1.5px] border-slate-500 text-black rounded-2xl bg-slate-50"
                          placeHolder="Password"
                          Type="password"
                          value={password}
                          setValue={setPassword}
                          placeholderColor="text-gray-500"
                          viewPasswordBtn={true}
                          showError={showError} // Pass the showError state
                          errorMessage={password.length < 4 ? "password is required" : ""}
                        />
                      </div>
                      <div className="w-full pt-3">
                        <button
                          className="login bg-[var(--main-blue-color)] w-full px-4 py-2.5 rounded-full"
                          onClick={handelLoginSubmit}>
                          login
                        </button>
                      </div>
                      <div className="w-full grid grid-cols-3 items-center justify-center py-2.5">
                        <span className="w-full h-[1px] bg-black inline-block rounded"></span>
                        <span className="text-slate-700 capitalize text-xs text-center">or login with </span>
                        <span className="w-full h-[1px] bg-black inline-block rounded"></span>
                      </div>
                      <div className="w-full grid grid-cols-1 items-center gap-3.5">
                        <button className="w-full capitalize bg-white text-black rounded-full px-3 py-3 flex items-center justify-center gap-2 ">
                          <FcGoogle className="text-2xl" />
                          <span className="inline-block">login with google</span>
                        </button>
                        <button className="w-full capitalize bg-slate-950 text-white rounded-full px-3 py-3 flex items-center justify-center gap-2">
                          <FaApple className="text-2xl" />
                          <span className="inline-block">login with apple</span>
                        </button>
                      </div>
                      <div className="w-full">
                        <p className="text-center text-sm text-slate-800 capitalize">
                          don't have account?{" "}
                          <Link
                            to={"/auth/signup"}
                            className="hover:underline hover:text-rose-600 cursor-pointer inline-block">
                            SignUp
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#b79c6f] w-60 h-60 rounded-full absolute -right-32 -bottom-32 circle-box-shadow"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
