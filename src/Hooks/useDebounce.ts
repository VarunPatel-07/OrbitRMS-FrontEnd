/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export const useDebounce = (callback: (...args: any[]) => void, delay: number = 500) => {
  const callbackRef = React.useRef(callback);
  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });
  let timer: any;

  const naiveDebounce = (func: (...args: any[]) => void, delayMs: number, ...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delayMs);
  };
  return React.useMemo(
    () =>
      (...args: any) =>
        naiveDebounce(callbackRef.current, delay, ...args),
    [delay]
  );
};
