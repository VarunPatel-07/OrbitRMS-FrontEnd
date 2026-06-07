/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useRef } from 'react';

export const useDebounce = (
  callback: (...args: any[]) => void,
  delay: number = 500
) => {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  const naiveDebounce = useCallback(
    (func: (...args: any[]) => void, delayMs: number, ...args: any[]) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        func(...args);
      }, delayMs);
    },
    []
  );

  return React.useMemo(
    () =>
      (...args: any) =>
        naiveDebounce(callbackRef.current, delay, ...args),
    [delay, naiveDebounce]
  );
};
