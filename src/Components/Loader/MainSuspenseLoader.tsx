import { useEffect, useRef, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

import OrbitRMSTransparentLogo from '../../assets/Images/orbitrms-final-logo-transperent.webp';
import { classNames } from '../../Helper/HelperFunctions';

function MainSuspenseLoader({ loading }: { loading: boolean }) {
  const [renderLoaderContent, setRenderLoaderContent] = useState(loading);
  const [fadeOut, setFadeOut] = useState(false);
  const loadingElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer = null;
    if (!loading) {
      timer = setTimeout(() => setFadeOut(true), 200);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading]);

  useEffect(() => {
    const handelAnimationEnd = () => {
      if (fadeOut) {
        setRenderLoaderContent(false);
      }
    };
    const loaderElem = loadingElementRef.current;
    if (loaderElem) {
      loaderElem.addEventListener('animationend', handelAnimationEnd);
    }
    return () => {
      if (loaderElem) {
        loaderElem.removeEventListener('animationend', handelAnimationEnd);
      }
    };
  }, [fadeOut]);

  if (renderLoaderContent || !fadeOut)
    return (
      <div
        ref={loadingElementRef}
        className={classNames(
          'w-screen h-screen bg-slate-50 backdrop-blur-sm fixed top-0 left-0 z-40',
          {
            'fade-out': fadeOut,
          }
        )}
      >
        <div className='w-full h-full flex items-center justify-center relative'>
          <div className='flex flex-col items-center justify-end gap-28'>
            <img
              src={OrbitRMSTransparentLogo}
              className='w-80 animate-pulse'
              alt='OrbitRMS Logo'
              loading='lazy'
            />
          </div>
          {loading && (
            <div className='absolute bottom-0 pb-20'>
              <AiOutlineLoading3Quarters className='animate-spin text-3xl text-slate-950 font-bold' />
            </div>
          )}
        </div>
      </div>
    );
}

export default MainSuspenseLoader;
