/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useRef } from 'react';

export function useMentionSearchDebounce<
  T extends (...args: any[]) => Promise<any>,
>(callback: T, delay: number = 500): T {
  const callbackRef = useRef(callback);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  const naiveDebounce = useCallback(
    (...args: Parameters<T>): Promise<ReturnType<T>> => {
      return new Promise((resolve) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(async () => {
          const result = await callbackRef.current(...args);
          resolve(result);
        }, delay);
      }) as Promise<ReturnType<T>>;
    },
    [delay]
  );
  return naiveDebounce as T;
}
