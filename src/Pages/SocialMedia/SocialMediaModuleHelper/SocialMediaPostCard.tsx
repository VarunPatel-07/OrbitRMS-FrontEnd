import { useRef } from 'react';

import { MdDelete, MdEdit } from 'react-icons/md';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Button from '../../../common/Button';
import { BeautifulSocialMediaPostStatusRenderer } from '../../../Helper/Helper';
import { classNames } from '../../../Helper/HelperFunctions';
import { SocialMediaPostCardInterface } from '../../../interface/SocialMediaModule';

function SocialMediaPostCard(props: SocialMediaPostCardInterface) {
  const { data, handelClickOnDeleteButton, permissionData } = props;
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className='w-full border border-black/10 rounded-lg relative overflow-hidden flex flex-col items-start justify-start'>
      <div className='w-full px-3.5 py-2.5 bg-gray-100 border-b border-black/10'>
        <div className='w-full flex items-center justify-between'>
          <div className='w-fit'>
            {BeautifulSocialMediaPostStatusRenderer(data?.status)}
          </div>
          <div className='w-fit flex items-center justify-end gap-2'>
            {permissionData?.permissions?.some(
              (item) => item?.label == 'edit' && item?.is_allowed
            ) && (
              <Button
                type='button'
                className='border border-black/45 p-1.5 rounded-[4px] hover:bg-white'
                disabled={data?.status !== 'scheduled'}
              >
                <MdEdit className='text-black text-base min-w-5 min-h-5' />
              </Button>
            )}
            {permissionData?.permissions?.some(
              (item) => item?.label == 'delete' && item?.is_allowed
            ) && (
              <Button
                type='button'
                className='border border-black/45 p-1.5 rounded-[4px] hover:bg-white'
                onClick={() =>
                  handelClickOnDeleteButton(data?.id, data?.selected_platforms)
                }
              >
                <MdDelete className='text-black text-base min-w-5 min-h-5' />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className='w-full grow flex flex-col items-start justify-start'>
        {JSON.parse(data?.media_urls)?.length > 0 && (
          <div className='p-3.5 relative w-full'>
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
              className='w-full h-full px-4 py-5 overflow-hidden rounded-lg relative'
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
              {JSON.parse(data?.media_urls)?.map(
                (image: string, index: number) => {
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
                            loading='lazy'
                          />
                        </picture>
                      </div>
                    </SwiperSlide>
                  );
                }
              )}
            </Swiper>
          </div>
        )}
        <div
          className={classNames(
            'px-3.5 pb-3.5 text-black w-full grow flex flex-col items-start justify-between',
            {
              'pt-3.5': JSON.parse(data?.media_urls)?.length == 0,
            }
          )}
        >
          <div className='w-full pb-4'>
            <p className='text-black text-base line-clamp-2'>{data?.caption}</p>
          </div>

          {data?.selected_platforms && (
            <div className='w-full border-t border-t-black/20 pt-3'>
              <p className='text-black text-sm'>Platforms:</p>
              <div className='flex items-center justify-start gap-2 pt-2'>
                {JSON.parse(data?.selected_platforms)?.map(
                  (item: string, _index: number) => (
                    <span
                      className='bg-blue-50 border border-blue-700 text-blue-700 text-xs px-1.5 py-0.5 capitalize rounded-md'
                      key={_index}
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SocialMediaPostCard;
