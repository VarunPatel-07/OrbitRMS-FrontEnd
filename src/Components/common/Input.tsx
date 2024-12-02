import React, { useState } from "react";
import clsx from "clsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputProps {
  Type?: "text" | "password" | "email" | "number"; // More specific input types
  value?: string;
  setValue?: (value: string) => void; // Function that updates the value
  placeHolder?: string; // Optional placeholder
  ClassName?: string;
  placeholderColor?: string;
  viewPasswordBtn?: boolean;
  showError?: boolean;
  errorMessage?: string;
}

function Input(props: InputProps) {
  const {
    Type,
    value,
    setValue,
    placeHolder,
    ClassName,
    placeholderColor,
    viewPasswordBtn = false,
    showError = false,
    errorMessage = "",
  } = props;

  const [isToggled, setIsToggled] = useState(false as boolean);

  const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const basicRegex = /^[a-zA-Z0-9\s]*$/;
    if (setValue) {
      if (Type === "email" || Type === "password") {
        setValue(val);
      } else {
        if (basicRegex.test(val)) {
          setValue(val);
        }
      }
    }
  };
  return (
    <>
      <div className={clsx("bg-transparent rounded-full w-full relative", ClassName)}>
        <input
          type={isToggled ? "text" : Type}
          value={value}
          onChange={updateValue}
          placeholder={placeHolder}
          className={`bg-transparent caret-black  w-full h-full focus:outline-none focus:ring-0 py-2.5 ${
            viewPasswordBtn ? "pl-4 pr-10" : "px-4"
          } autofill:bg-black autofill:text-black placeholder:${placeholderColor}`}
          style={{ border: 0, color: "black" }}
        />
        {Type === "password" && viewPasswordBtn ? (
          <span
            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 inline-block text-lg z-10"
            onClick={() => setIsToggled(!isToggled)}>
            {isToggled ? <FaEye /> : <FaEyeSlash />}
          </span>
        ) : null}
      </div>
      {showError && errorMessage && (
        <span className="text-rose-600 text-[10px] capitalize mt-1 block px-3.5">{errorMessage}</span>
      )}
    </>
  );
}

export default Input;
