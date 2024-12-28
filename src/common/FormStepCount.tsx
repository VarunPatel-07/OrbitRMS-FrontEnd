import { FaCheck } from "react-icons/fa";

function FormStepCount({
  alignment = "horizontal",
  currentSliderCounter,
  totalCounter,
  counterStepsNameArray,
  validateInputAndAdvanceSlider,
}: {
  alignment?: "vertical" | "horizontal";
  currentSliderCounter: number;
  totalCounter: number;
  counterStepsNameArray: Array<string>;
  validateInputAndAdvanceSlider: (counter: number) => void;
}) {
  const handelSliderIndicatorNavbarButton = (sliderButton: number) => {
    validateInputAndAdvanceSlider(sliderButton - 1);
  };
  return (
    <div
      className={`w-full flex items-start justify-center gap-2 flex-nowrap overflow-auto ${
        alignment == "vertical" ? "flex-col" : "flex-row"
      } `}>
      {Array.from({ length: totalCounter }, (_, index) => {
        const counterIndex = index + 1;
        return (
          <div
            className={`flex justify-center gap-2 ${
              alignment == "vertical" ? "flex-col items-start" : "flex-row justify-center"
            } `}
            key={index}>
            <div className="flex items-center justify-start gap-3.5">
              <button
                className={`min-w-10 min-h-10 rounded-full flex items-center justify-center text-xl font-sans font-bold transition-all duration-500 ${
                  currentSliderCounter == counterIndex
                    ? "opacity-100"
                    : currentSliderCounter < counterIndex
                    ? "opacity-50"
                    : ""
                } text-slate-900 ${currentSliderCounter > counterIndex ? "bg-green-600" : "bg-white"}`}
                onClick={() => handelSliderIndicatorNavbarButton(counterIndex)}>
                {currentSliderCounter > counterIndex ? (
                  <FaCheck className="text-slate-50 transition-all w-4" />
                ) : (
                  counterIndex
                )}
              </button>
              <h5
                className={`text-white text-lg capitalize font-sans transition-all ${
                  currentSliderCounter == counterIndex
                    ? "opacity-100"
                    : currentSliderCounter < counterIndex
                    ? "opacity-50"
                    : ""
                }`}>
                {counterStepsNameArray[index]}
              </h5>
            </div>
            {counterIndex === totalCounter ? (
              ""
            ) : (
              <div
                className={`flex flex-col items-center justify-center gap-2 ${
                  alignment == "vertical" ? "min-w-10" : "min-w-16"
                }`}>
                <span
                  className={`inline-block relative ${
                    alignment == "vertical" ? "min-h-16 min-w-1" : "min-w-16 min-h-1"
                  }`}>
                  <span
                    className={`bg-gray-500 inline-block rounded-sm absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 ${
                      alignment == "vertical" ? "min-h-16 min-w-1" : "min-w-16 min-h-1"
                    }`}></span>
                  <span
                    className={`bg-green-600 inline-block rounded-sm absolute transition-all duration-500 ${
                      currentSliderCounter >= counterIndex + 1
                        ? alignment == "vertical"
                          ? "scale-y-100"
                          : "scale-x-100"
                        : alignment == "vertical"
                        ? "scale-y-0"
                        : "scale-x-0"
                    } ${
                      alignment == "vertical"
                        ? "min-h-16 min-w-1 top-0 -translate-x-1/2 left-1/2 origin-top"
                        : "min-w-16 min-h-1 top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 origin-left"
                    }`}></span>
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default FormStepCount;
