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
    <div className='w-full h-screen overflow-hidden'>
      <div className='w-full h-full flex flex-col items-center justify-between relative'>
        <div className='flex flex-col items-center justify-between w-full py-8 px-6 gap-6 relative z-20'>
          <div className='flex flex-col items-center justify-between w-full gap-3'>
            <h3 className='text-black font-semibold text-2xl font-inter'>
              It’s a bit quiet here… 👀
            </h3>
            <h3 className='text-black font-semibold font-inter capitalize text-lg'>
              Say hello to the world — create your first post!
            </h3>
          </div>
          <div className='w-full flex flex-col gap-5 items-center justify-center'>
            <p className='text-sm text-black/80 text-center text-pretty w-[90%] m-auto'>
              Share your thoughts, ideas, or updates and let others join the
              conversation. Your journey starts with one click — go ahead, make
              it count!
            </p>
            {CTAButton && CTAButton}
          </div>
        </div>
        {/* lottie animation */}
        <div className='w-[90%] absolute -bottom-[10%] z-10'>
          <DotLottieReact
            src={EmptyFeedLottieAnimation}
            loop
            autoplay
            className='w-full h-full'
            width={'100%'}
            height={'100%'}
          />
        </div>
      </div>
    </div>
  );
}

export default EmptyFeedAnimation;
