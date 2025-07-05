import 'swiper/swiper-bundle.css';

import { useRef } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import DashboardHolidayAnimation from '../assets/lottie/DashboardHolidayAnimation.lottie';
import {
  classNames,
  compareDates,
  formateDate,
} from '../Helper/HelperFunctions';
import { HolidayedPropsInterFace } from '../interface/Dashboard';

function HolidayCard(props: HolidayedPropsInterFace) {
  const { holidayData, GlobalStateProvider } = props;

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className='w-full bg-white border border-black/15 rounded-lg h-auto min-h-[200px] overflow-hidden max-h-[200px]'>
      <div className='w-full h-full relative'>
        <div className='absolute top-0 left-0 w-full px-4 py-3 z-10'>
          <div className='flex items-center justify-between'>
            <p className='text-lg text-black font-inter font-semibold'>
              Holiday
            </p>
            <div className='flex items-center justify-end gap-2'>
              <button
                className='w-6 h-6 flex items-center justify-center border border-black/20 rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                ref={prevRef}
              >
                <RiArrowLeftSLine className='text-slate-900 text-xl' />
              </button>

              <button
                className='w-6 h-6 flex items-center justify-center border border-black/20 rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                ref={nextRef}
              >
                <RiArrowRightSLine className='text-slate-900 text-xl' />
              </button>
            </div>
          </div>
        </div>
        <div className='w-full h-full flex items-end justify-start'>
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              if (
                swiper.params.navigation &&
                typeof swiper.params.navigation !== 'boolean'
              ) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
            spaceBetween={0}
            slidesPerView={1}
            allowTouchMove={false}
            className='w-full h-full  px-4 py-5'
          >
            {holidayData?.map((holiday) => {
              if (holiday?.date) {
                const isItUpcoming = compareDates(holiday?.date);

                return (
                  <SwiperSlide
                    key={holiday?.id}
                    className={classNames('w-full h-full', {
                      'bg-gray-300': !isItUpcoming,
                      'bg-white': isItUpcoming,
                    })}
                  >
                    <div className='flex flex-col items-start justify-end p-4 w-full h-full'>
                      <p className='text-xl text-black font-semibold text-nowrap text-ellipsis overflow-hidden w-[65%]'>
                        {holiday?.holiday_name}
                      </p>
                      <p className='text-base text-black'>
                        {formateDate(
                          new Date(holiday?.date)?.toString(),
                          GlobalStateProvider?.organization
                            ?.organization_settings?.default_dateformat,
                          false
                        )}
                      </p>
                    </div>
                  </SwiperSlide>
                );
              }
            })}
          </Swiper>
        </div>

        <div className='absolute bottom-0 -right-14 h-[150px] w-[300px] z-10'>
          <DotLottieReact
            src={DashboardHolidayAnimation}
            loop
            autoplay
            height={'300%'}
            width={'300%'}
          />
        </div>
      </div>
    </div>
  );
}

export default HolidayCard;
