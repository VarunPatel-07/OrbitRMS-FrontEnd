import { useEffect, useRef } from 'react';

import { AxiosError } from 'axios';

import {
  ApiReturnInterface,
  endpointObject,
  multipleFetchApi,
} from '../Helper/api/multipleAPI';
import { useDebounce } from './useDebounce';

interface useDebounceMultipleFetchApiInterface {
  endPoint: endpointObject[];
  onSuccess: (res: ApiReturnInterface[]) => void;
  onError: (err: AxiosError) => void;
  delay?: number;
}

export const useDebounceMultipleFetchApi = ({
  endPoint,
  onSuccess,
  onError,
  delay = 100,
}: useDebounceMultipleFetchApiInterface) => {
  const abortControllerRef = useRef<AbortController | null>(null);

  const debounceFetch = useDebounce(() => {
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    multipleFetchApi(endPoint, signal)
      .then((res) => {
        onSuccess(res);
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') {
          onError?.(err);
        }
      });
  }, delay);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return debounceFetch;
};
