import { useRef } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { classNames, formateDate } from '../Helper/HelperFunctions';
import { FeedPostDataPropsInterface } from '../interface/Dashboard';
import { GlobalContextStore } from '../interface/UserProfileInterface';
import EmployeeProfilePicture from './EmployeeProfilePicture';

interface propsInterface {
  data: FeedPostDataPropsInterface;
  GlobalStateProvider: GlobalContextStore;
}

function FeedPostCard(props: propsInterface) {
  const { data, GlobalStateProvider } = props;
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  return (
    <div className='w-full border border-black/10 rounded-lg overflow-hidden'>
      <div className='w-full flex items-center justify-between px-3.5 py-2 bg-[var(--main-white-color)] border-b border-b-black/10'>
        <div className='flex items-center justify-start gap-3'>
          <EmployeeProfilePicture
            profilePicture={data?.publisher?.profile_picture}
            height={35}
            width={35}
          />
          <div className='flex flex-col items-start justify-start gap-0.5'>
            {GlobalStateProvider?.user?.personal_info?.user_id ==
            data?.publisher?.id ? (
              <p className='text-black flex items-center justify-start text-sm font-semibold gap-1'>
                <span>You</span>
              </p>
            ) : (
              <Link
                to={`/${GlobalStateProvider?.organization?.general_info?.portal_slug}/employee-profile/${data?.publisher?.id}/employee-details`}
                target='_blank'
                className='text-black flex items-center justify-start text-sm font-semibold gap-1 hover:text-blue-700'
              >
                <span className='block'>
                  {data?.publisher?.full_name
                    ? data?.publisher?.full_name
                    : data?.publisher?.first_name +
                      ' ' +
                      data?.publisher?.middle_name +
                      ' ' +
                      data?.publisher?.last_name}
                </span>
                <span className='block'>
                  ({data?.publisher?.employee_code})
                </span>
              </Link>
            )}

            <p className='text-black/70 text-xs'>
              {formateDate(
                data?.created_at,
                GlobalStateProvider?.organization?.organization_settings
                  ?.default_dateformat,
                false
              )}
            </p>
          </div>
        </div>
      </div>
      {JSON.parse(data?.images)?.length > 0 && (
        <div className='p-3.5 relative'>
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
            className='w-full h-full  px-4 py-5 overflow-hidden rounded-lg relative'
          >
            <button
              className='w-10 h-10 flex items-center justify-center border border-black/20 rounded-full bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed absolute top-1/2 -translate-x-1/2 left-7 z-10'
              ref={prevRef}
            >
              <RiArrowLeftSLine className='text-slate-900 text-3xl' />
            </button>

            <button
              className='w-10 h-10 flex items-center justify-center border border-black/20 rounded-full bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed absolute top-1/2 -translate-x-1/2 -right-2 z-10'
              ref={nextRef}
            >
              <RiArrowRightSLine className='text-slate-900 text-3xl' />
            </button>
            {JSON.parse(data?.images)?.map((image: string, index: number) => {
              return (
                <SwiperSlide key={index}>
                  <div className='w-full h-full min-h-[360px] max-h-[360px] aspect-video'>
                    <picture>
                      <source src={image} />
                      <img
                        src={image}
                        alt='Post Slider Image'
                        width={'100%'}
                        height={'100%'}
                        className='object-cover w-full h-full aspect-video'
                      />
                    </picture>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
      <div
        className={classNames('px-3.5 pb-3.5 text-black', {
          'pt-3.5': JSON.parse(data?.images)?.length == 0,
        })}
      >
        <div
          dangerouslySetInnerHTML={{ __html: JSON.parse(data?.description) }}
        ></div>
      </div>
    </div>
  );
}

export default FeedPostCard;
