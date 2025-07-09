import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import AuthPageAnimation from '../../assets/lottie/AuthPageAnimation.lottie';

function AuthLottieAnimation() {
  return (
    <div className='absolute min-w-[250px] min-h-[250px] lg:w-1/2 lg:max-w-[450px] lg:max-h-[450px] lg:h-auto xl:w-full xl:h-full xl:max-w-[600px] xl:max-h-[500px] 2xl:max-w-[650px] 2xl:max-h-[550px] z-30 hidden lg:block bottom-[-10%] left-[2%] lg:bottom-[-2%] lg:left-[-1%] xl:left-[5%] 2xl:bottom-[-8%]'>
      <DotLottieReact
        src={AuthPageAnimation}
        loop
        autoplay
        className='w-full h-full'
        width={'100%'}
        height={'100%'}
      />
    </div>
  );
}

export default AuthLottieAnimation;
