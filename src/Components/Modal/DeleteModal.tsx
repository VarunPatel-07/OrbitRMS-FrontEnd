import React, { SetStateAction, useEffect, useRef } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { classNames } from "../../Helper/HelperFunctions";

function DeleteModal({
  showDeleteModal,
  setShowDeleteModal,
}: {
  showDeleteModal: boolean;
  setShowDeleteModal: React.Dispatch<SetStateAction<boolean>>;
}) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handelClickOutSideTheBox = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setShowDeleteModal(false);
      }
    };
    document.addEventListener("mousedown", handelClickOutSideTheBox);
    return () => {
      document.addEventListener("mouseup", handelClickOutSideTheBox);
    };
  }, []);
  return (
    <div
      className={classNames("w-full h-full absolute top-0 left-0 bg-[rgba(0,0,0,0.4)] z-10 transition-all", {
        "scale-0 opacity-0": !showDeleteModal,
        "scale-100 opacity-100": showDeleteModal,
      })}>
      <div className="w-full h-full flex items-center justify-center">
        <div
          className="delete-modal bg-white min-h-[300px] min-w-[600px] px-8 rounded-lg relative overflow-hidden flex flex-col items-start justify-end"
          ref={boxRef}>
          <div className="delete absolute -top-[15%]  -left-[10%]">
            <span className="p-4 flex items-center justify-center overflow-hidden rounded-full border border-red-200">
              <span className="p-4 flex items-center justify-center overflow-hidden rounded-full border border-red-200">
                <span className="p-4 flex items-center justify-center overflow-hidden rounded-full border border-red-200">
                  <span className="p-6 flex items-center justify-center overflow-hidden rounded-full border border-red-300">
                    <MdDeleteOutline className="text-red-400 text-3xl" />
                  </span>
                </span>
              </span>
            </span>
          </div>
          <div className="relative z-10 w-full h-full flex flex-col items-start justify-end pb-5 gap-7">
            <div className="flex flex-col items-start justify-start gap-1">
              <h4 className="text-[26px] text-slate-950 font-bold font-inter">Delete This</h4>
              <p className="text-base text-slate-950 font-inter">
                Are you sure you want to delete this? This action is irreversible.
              </p>
            </div>
            <div className="grid grid-cols-2 w-full gap-x-2">
              <button
                className="text-indigo-600 w-full py-2.5 rounded-lg font-inter border border-indigo-600 text-base font-semibold hover:bg-indigo-600 hover:text-white transition-all"
                onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="text-white bg-rose-600 hover:bg-rose-700/90 w-full py-2.5 rounded-lg font-inter text-base font-semibold transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
