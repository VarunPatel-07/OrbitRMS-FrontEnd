import { Link } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import SpaceBoyDeveloper from '../../assets/lottie/SpaceBoyDeveloper.lottie';
import { NoHolidayCardPropsInterface } from '../../interface/interface';

function NoHolidayAnimationCard(props: NoHolidayCardPropsInterface) {
  const { portalSlug } = props;
  return (
    <div className='w-full h-full'>
      <div className='flex flex-col w-full h-full items-center justify-between text-center text-gray-500 p-5'>
        <div className='w-20 h-20 overflow-hidden relative'>
          <div className='w-[200%] h-[170%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <DotLottieReact
              src={SpaceBoyDeveloper}
              loop
              autoplay
              className='w-full h-full'
              width={'100%'}
              height={'100%'}
            />
          </div>
        </div>

        <p className='mt-2.5 font-bold text-lg text-black font-inter'>
          Whoa, no holidays yet?
        </p>
        <p className='text-base text-black/70 font-inter max-w-[80%]'>
          Drop some dates and give the team something to look forward to!
        </p>

        <Link
          to={`/${portalSlug}/organization-settings/holiday`}
          className='mt-2.5 inline-block bg-[var(--them-green-color)] text-white text-sm font-medium px-4 py-1.5 rounded transition font-inter'
        >
          + Add Holiday
        </Link>
      </div>
    </div>
  );
}

export default NoHolidayAnimationCard;
