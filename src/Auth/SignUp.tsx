import Illustration from "../assets/Images/a-minimalistic-illustration-of-a-professional-woma-qB-EvpaUTCW_7VPIzQCwAA-liCsDCsyRx6jUnjJ69VBsw.jpeg";
import OrbitRMS from "../assets/Images/OrbitRMS-White-Transperent-Logo.png";
import Input from "../common/Input";
import "./auth.css";
import HelmetSeo from "../Helper/HelmetSeo";
import { useEffect, useState } from "react";
import { isValidEmail } from "../Helper/HelperFunctions";
import { Link } from "react-router-dom";
import MainSuspenseLoader from "../Components/Loader/MainSuspenseLoader";
import { signUpApiFunction, verifyUsersLoginStatus } from "../Helper/api/api";
import { signUpForm } from "../interface/funcParamInterface";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaStarOfLife } from "react-icons/fa";

function SignUp() {
  const [email, setEmail] = useState("" as string);
  const [password, setPassword] = useState("" as string);
  const [organizationName, setOrganizationName] = useState("" as string);
  const [portalUrl, setPortalUrl] = useState("" as string);
  const [userName, setUserName] = useState("" as string);
  const [showError, setShowError] = useState(false as boolean);
  const [buttonLoader, setButtonLoader] = useState(false as boolean);
  const [showGlobalLoader, setShowGlobalLoader] = useState(true as boolean);

  const handelLoginSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (
      email.length < 1 ||
      password.length < 4 ||
      organizationName.length < 1 ||
      portalUrl.length < 1 ||
      userName.length < 1
    ) {
      setShowError(true);
    } else {
      if (!isValidEmail(email)) {
        setShowError(true);
      }
    }
    if (
      email.length >= 1 &&
      password.length >= 4 &&
      organizationName.length >= 1 &&
      portalUrl.length >= 1 &&
      userName.length >= 1 &&
      isValidEmail(email)
    ) {
      const signUp: signUpForm = {
        email,
        organizationName,
        portalUrl,
        password,
        userName,
      };
      setButtonLoader(true);
      await signUpApiFunction("auth/signUp", signUp, "POST", setButtonLoader);
    }
  };

  useEffect(() => {
    verifyUsersLoginStatus(setShowGlobalLoader);
  }, []);

  useEffect(() => {
    if (organizationName) setPortalUrl(organizationName);
  }, [organizationName]);

  return (
    <>
      <HelmetSeo
        Title="SignUp | OrbitRMS"
        Content="SignUp To OrbitRMS to simplify your work, manage everything in one place, and stay ahead with ease!"
      />

      <MainSuspenseLoader loading={showGlobalLoader} />
      {!showGlobalLoader && (
        <div className="w-full h-screen">
          <div className="w-full h-full flex items-center justify-center bg-white overflow-hidden">
            <div className="w-full h-full flex items-stretch justify-center overflow-hidden">
              <div className="w-[40%] h-full bg-[var(--main-blue-color)] flex flex-col items-center justify-between">
                <div className="w-full flex items-center justify-center py-3">
                  <img src={OrbitRMS} alt="" className="w-48" />
                </div>
                <img src={Illustration} alt="A Woman Setting On The Computer" className="w-full h-fit object-cover" />
              </div>
              <div className="w-[60%] bg-[#e8e2e0] relative">
                <div className="w-full h-full px-4 pt-4 pb-8 flex flex-col justify-between">
                  <div className="w-full px-3 py-3  max-w-[400px] me-auto">
                    <h1 className="text-[#242c40] text-4xl font-serif text-nowrap text-start">
                      SignUp To <span className="font-semibold">Orbit</span>RMS
                    </h1>
                    <p className="font-serif text-[#242c40] font-normal text-base capitalize pt-2">
                      to simplify your work, manage everything in one place, and stay ahead with ease!
                    </p>
                  </div>
                  <div className="w-full flex items-center justify-center h-full">
                    <div className="login-form min-w-[50%] bg-[#e8e2e02f] backdrop-blur-sm relative z-10 rounded-lg border border-[#242c40]">
                      <div className="py-10 px-12 max-h-[555px] overflow-auto hide-scrollbar scroll-mt-6">
                        <div className="grid grid-cols-1 w-full gap-5">
                          <div className="w-full">
                            <Input
                              ClassName="border-[1.5px] border-slate-500 text-black rounded-lg bg-slate-50"
                              placeHolder="Organization Name"
                              Type="text"
                              value={organizationName}
                              setValue={setOrganizationName}
                              placeholderColor="text-gray-500"
                              isRequiredField={true}
                              labelFieldName="Organization Name"
                              showLabelField={true}
                              showError={showError} // Pass the showError state
                              errorMessage={organizationName.length < 1 ? "This field is required" : ""}
                            />
                          </div>
                          <div className="w-full">
                            <Input
                              ClassName="border-[1.5px] border-slate-500 text-black rounded-lg bg-slate-50"
                              placeHolder="Organization Email"
                              Type="email"
                              value={email}
                              setValue={setEmail}
                              placeholderColor="text-gray-500"
                              isRequiredField={true}
                              labelFieldName="Organization Email"
                              showLabelField={true}
                              showError={showError} // Pass the showError state
                              errorMessage={email.length < 1 ? "This field is required" : ""}
                            />
                          </div>
                          <div className="w-full">
                            <label
                              htmlFor=""
                              className="text-sm font-sans font-normal text-[var(--main-blue-color)] pb-2 inline-block">
                              <span className="flex gap-1">
                                <span>Portal Url</span>
                                <FaStarOfLife className="w-1.5 text-red-700" />
                              </span>
                            </label>
                            <div className="flex items-center">
                              <div className="h-full flex items-end w-fit">
                                <span className="h-[42px] flex items-center justify-start text-black bg-slate-100 border-[1.5px] border-slate-500 border-r-0 py-2.5 px-4 rounded-l-lg opacity-50">
                                  http://localhost:5173
                                </span>
                              </div>
                              <div className="w-full">
                                <Input
                                  ClassName="border-[1.5px] border-slate-500 !text-blue-700 rounded-lg rounded-l-none bg-slate-50"
                                  placeHolder="Url Slug"
                                  Type="text"
                                  value={portalUrl.toLocaleLowerCase()}
                                  setValue={setPortalUrl}
                                  placeholderColor="text-gray-500"
                                  showError={showError} // Pass the showError state
                                  errorMessage={userName.length < 1 ? "This field is required" : ""}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="w-full">
                            <Input
                              ClassName="border-[1.5px] border-slate-500 text-black rounded-lg bg-slate-50"
                              placeHolder="Email"
                              Type="email"
                              value={email}
                              setValue={setEmail}
                              placeholderColor="text-gray-500"
                              isRequiredField={true}
                              labelFieldName="Website Url"
                              showLabelField={true}
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
                              ClassName="border-[1.5px] border-slate-500 text-black rounded-lg rounded-l-none bg-slate-50"
                              placeHolder="Password"
                              Type="number"
                              value={password}
                              setValue={setPassword}
                              placeholderColor="text-gray-500"
                              isRequiredField={true}
                              labelFieldName="Contact Number"
                              showLabelField={true}
                              viewPasswordBtn={true}
                              showError={showError} // Pass the showError state
                              errorMessage={password.length < 4 ? "password is required" : ""}
                              showCountryCodeSlug={true}
                            />
                          </div>
                          <div className="w-full pt-3">
                            <button
                              className="login bg-[var(--main-blue-color)] w-full px-4 py-2.5 rounded-full disabled:opacity-70 disabled:cursor-not-allowed"
                              onClick={handelLoginSubmit}
                              disabled={buttonLoader}>
                              {buttonLoader ? (
                                <span
                                  className="flex items-center justify-center gap-3"
                                  role="status"
                                  aria-live="polite">
                                  <span>
                                    <AiOutlineLoading3Quarters className="animate-spin text-base font-extrabold text-primary" />
                                  </span>
                                  <span>Signing in...</span>
                                </span>
                              ) : (
                                "SignUp"
                              )}
                            </button>
                          </div>

                          <div className="w-full">
                            <p className="text-center text-sm text-slate-800 capitalize">
                              all ready have an account?{" "}
                              <Link
                                to={"/auth/login"}
                                className="hover:underline hover:text-rose-600 cursor-pointer inline-block">
                                login
                              </Link>
                            </p>
                          </div>
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
      )}
    </>
  );
}

export default SignUp;
