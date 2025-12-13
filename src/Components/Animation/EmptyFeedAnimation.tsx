import React from 'react';

import EmptyFeedLottieAnimation from '../../assets/lottie/EmptyFeedAnimation.lottie';
import { EmptyFeedAnimationPropsInterface } from '../../interface/Dashboard';

const DotLottieReact = React.lazy(() =>
  import('@lottiefiles/dotlottie-react').then((mod) => ({
    default: mod.DotLottieReact,
  }))
);

function EmptyFeedAnimation(props: EmptyFeedAnimationPropsInterface) {
  const { CTAButton } = props;
  return (
    <div className='w-full h-screen overflow-hidden bg-gradient-to-br from-white via-gray-50 to-green-50/20'>
      <div className='w-full h-full flex flex-col items-center justify-center relative px-6'>
        {/* Decorative background elements */}
        <div className='absolute top-20 left-10 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl'></div>
        <div className='absolute bottom-32 right-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl'></div>

        {/* Main content container */}
        <div className='flex flex-col items-center justify-center w-full max-w-md gap-3 relative z-20'>
          {/* Lottie animation - moved to top */}
          <div className='w-full max-w-[250px] transform hover:scale-105 transition-transform duration-300 -mt-10'>
            <React.Suspense
              fallback={
                <div className='w-full h-64 bg-white/50 rounded-2xl animate-pulse'></div>
              }
            >
              <DotLottieReact
                src={EmptyFeedLottieAnimation}
                loop
                autoplay
                className='w-full h-full drop-shadow-2xl'
                width={'100%'}
                height={'100%'}
              />
            </React.Suspense>
          </div>

          {/* Text content */}
          <div className='flex flex-col items-center gap-2.5 text-center'>
            <div className='flex flex-col gap-2'>
              <h3 className='text-gray-800 font-bold text-2xl font-inter tracking-tight'>
                Nothing to see here... yet! 👀
              </h3>
              <h4 className='text-gray-600 font-medium font-inter text-lg'>
                Be the first to break the silence
              </h4>
            </div>

            <div className='w-full flex flex-col gap-6 items-center justify-center'>
              <p className='text-base text-gray-500 leading-relaxed max-w-sm'>
                Your feed is waiting for its first story. Share what's on your
                mind and start building your community today.
              </p>

              {/* CTA Button container with enhanced styling */}
              {CTAButton && (
                <div className='w-full flex justify-center transform hover:scale-105 transition-transform duration-200'>
                  {CTAButton}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className='absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/40 to-transparent pointer-events-none'></div>
      </div>
    </div>
  );
}

export default EmptyFeedAnimation;
