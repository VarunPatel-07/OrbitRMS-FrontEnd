import { AlertModalProps } from "../interface/propsInterface";
import { classNames } from "../Helper/HelperFunctions";
import { MdOutlineDoNotDisturbOn } from "react-icons/md";
import { BsCheckCircle } from "react-icons/bs";
import Button from "./Button";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

function AlertModal(props: AlertModalProps) {
  const { ModalInfo, showAlertModal, setShowAlertModal } = props;

  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handelClickOutSideTheBox = (event: MouseEvent) => {
      if (!ModalInfo?.protected) {
        if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
          setShowAlertModal(false);
        }
      }
    };
    document.addEventListener("mousedown", handelClickOutSideTheBox);
    return () => {
      document.removeEventListener("mousedown", handelClickOutSideTheBox);
    };
  }, [ModalInfo?.protected, setShowAlertModal]);

  return (
    <div
      className={classNames(
        "w-screen h-screen absolute top-0 left-0 z-20 bg-black/[0.6] backdrop-blur-[1px] transition-all",
        {
          "scale-50 opacity-0 invisible origin-center": !showAlertModal,
          "scale-100 opacity-100 visible origin-center": showAlertModal,
        }
      )}>
      <div className="w-full h-full flex items-center justify-center">
        <div className="min-w-[480px] max-w-[550px] rounded-lg bg-white px-9 py-9" ref={boxRef}>
          <div className="grid grid-cols-1 gap-9">
            {/* It Is used To Show Case The Icon Related To The Action Modal */}
            <div className="w-full flex items-center justify-center">
              <div className="w-[110px] h-[110px] relative">
                <span
                  className={classNames(
                    "rounded-full flex items-center justify-center aspect-square w-[90px] h-[90px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]",
                    {
                      "border-2 border-red-700/[0.1]": !ModalInfo.success,
                      "border-2 border-green-700/[0.1]": ModalInfo.success,
                    }
                  )}></span>
                <span
                  className={classNames(
                    "rounded-full flex items-center justify-center aspect-square w-[75px] h-[75px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2]",
                    {
                      "border-2 border-red-700/[0.25]": !ModalInfo.success,
                      "border-2 border-green-700/[0.25]": ModalInfo.success,
                    }
                  )}></span>
                <span
                  className={classNames(
                    "rounded-full flex items-center justify-center aspect-square w-[60px] h-[60px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3]",
                    {
                      "border-2 border-red-700/[0.35]": !ModalInfo.success,
                      "border-2 border-green-700/[0.35]": ModalInfo.success,
                    }
                  )}></span>
                <span
                  className={classNames(
                    "rounded-full flex items-center justify-center aspect-square w-[45px] h-[45px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[4]",
                    {
                      "border-2 border-red-700/[0.6]": !ModalInfo.success,
                      "border-2 border-green-700/[0.6]": ModalInfo.success,
                    }
                  )}></span>
                {ModalInfo.success ? (
                  <BsCheckCircle className="text-green-700 w-7 h-7 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5]" />
                ) : (
                  <MdOutlineDoNotDisturbOn className="text-red-700 w-7 h-7 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5]" />
                )}
              </div>
            </div>
            <div className="w-full">
              <h3 className="text-black text-[28px] font-semibold font-inter text-pretty">
                {ModalInfo?.alertModalTitle}
              </h3>
            </div>
            <div className="w-full">
              <p
                className="text-black font-inter text-base text-pretty"
                dangerouslySetInnerHTML={{ __html: ModalInfo?.alertModelInfo }}></p>
            </div>
            <div className="w-full">
              <div className="grid grid-cols-1 gap-6">
                {ModalInfo?.optionsButtonArray?.map((item) =>
                  item?.link?.trim().length == 0 ? (
                    <Button Type="button" className={item?.classNames} onClick={item?.onclickFunction}>
                      <span className="flex items-center justify-center gap-2">
                        {item?.icon}
                        <span>{item?.buttonTitle}</span>
                      </span>
                    </Button>
                  ) : (
                    <Link to={item?.link || ""} className={item?.classNames}>
                      <span className="flex items-center justify-center gap-2">
                        {item?.icon}
                        <span>{item?.buttonTitle}</span>
                      </span>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertModal;
