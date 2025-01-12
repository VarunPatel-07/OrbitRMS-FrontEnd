import React, { useCallback, useState } from "react";
import clsx from "clsx";
import { FaCloudUploadAlt, FaEye, FaEyeSlash, FaStarOfLife } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { URLSafetyCheckerFunction } from "../Helper/URLSafetyCheckerFunction";
import { InputProps } from "../interface/propsInterface";

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
    showLabelField = false,
    labelFieldName,
    isRequiredField = false,
    RequiredFileTypeArray,
    setUrlErrorType,
    showDropFileScreenInFullScreen = true,
  } = props;

  const [isToggled, setIsToggled] = useState(false as boolean);

  const updateValue = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const basicRegex = /^[a-zA-Z0-9\s]*$/;
    if (!setValue) return;
    switch (Type) {
      case "url":
        if (val.length >= 0) {
          setValue(val);
          const result: { urlStatus: string; isError: boolean; isEmptyString: boolean } =
            await URLSafetyCheckerFunction(val);
          if (setUrlErrorType) {
            setUrlErrorType(result.urlStatus);
          }
        }
        break;
      case "email":
      case "password":
        setValue(val);
        break;
      default:
        if (basicRegex.test(val)) {
          setValue(val);
        }
        break;
    }
  };

  const uploadingFilesTypeCheckingFunction = (file: File) => {
    if (RequiredFileTypeArray?.includes(file.type)) {
      return true;
    } else {
      return false;
    }
  };

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    console.log(acceptedFiles);
    acceptedFiles.map((eachFile: File) => {
      if (uploadingFilesTypeCheckingFunction(eachFile)) {
        console.log("allowed for", eachFile.name);
      } else {
        console.log("wrong formate for ", eachFile.name);
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      {showLabelField && (
        <label
          htmlFor=""
          className="text-base font-sans font-semibold text-[var(--main-blue-color)] pb-1.5 inline-block">
          <span className="flex gap-0.5">
            <span>{labelFieldName}</span>
            {isRequiredField && <FaStarOfLife className="w-1.5 text-red-700" />}
          </span>
        </label>
      )}
      {Type === "file" ? (
        <div {...getRootProps()} className="mt-1.5">
          <input {...getInputProps()} />
          {isDragActive ? (
            showDropFileScreenInFullScreen ? (
              <div className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-sm z-50 flex items-center justify-center">
                <h6 className="text-5xl font-sans font-semibold">Drop the files here ...</h6>
              </div>
            ) : (
              <>
                <div className="py-6 px-24  z-10 flex flex-col gap-2 items-center justify-center border border-indigo-500 border-dashed rounded-lg bg-[rgba(99,102,241,0.08)]">
                  <FaCloudUploadAlt className="w-20 h-20 text-indigo-600" />
                  <p className="text-base font-semibold text-indigo-700">Drop Files to Upload</p>
                </div>
              </>
            )
          ) : (
            <>
              <div className="py-6 px-24  z-10 flex flex-col gap-2 items-center justify-center border border-indigo-500 border-dashed rounded-lg bg-[rgba(99,102,241,0.08)]">
                <FaCloudUploadAlt className="w-20 h-20 text-indigo-600" />
                <p className="text-base text-black">
                  Drag & Drop Files or <span>Browse</span>
                </p>
              </div>
            </>
          )}
        </div>
      ) : (
        <div
          className={clsx("bg-transparent rounded-full w-full relative", ClassName)}
          style={{ border: showError && errorMessage ? "1px solid red" : "" }}>
          <input
            type={isToggled ? "text" : Type}
            value={value}
            onChange={updateValue}
            placeholder={placeHolder}
            className={`bg-transparent caret-black  w-full h-full text-base focus:outline-none focus:ring-0 py-2.5 ${
              viewPasswordBtn ? "pl-4 pr-10" : "px-4"
            } autofill:!bg-black autofill:text-black placeholder:${placeholderColor}`}
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
      )}
      {showError && errorMessage && (
        <span className="text-rose-600 text-xs capitalize mt-1 block px-1.5">{errorMessage}</span>
      )}
    </>
  );
}

export default Input;
