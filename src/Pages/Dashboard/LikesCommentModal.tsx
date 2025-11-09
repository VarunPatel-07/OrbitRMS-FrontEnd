import { useContext, useEffect, useRef, useState } from 'react';
import { IoMdHeart } from 'react-icons/io';
import { LuMessageCircleReply } from 'react-icons/lu';

import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../Context/Notification/NotificationContextApi';
import { endpointObject, multipleFetchApi } from '../../Helper/api/multipleAPI';
import { classNames } from '../../Helper/HelperFunctions';
import { useDebounce } from '../../Hooks/useDebounce';
import {
  LikesCommentsDataInterface,
  LikesCommentsModalInterface,
} from '../../interface/Dashboard';

function LikesCommentModal(props: LikesCommentsModalInterface) {
  const { type, showModal, handelCancelButton, postId, setFeedPostData } =
    props;

  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const [isVisible, setIsVisible] = useState<boolean>(showModal);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<LikesCommentsDataInterface[]>([]);
  const modalBoxRef = useRef<HTMLDivElement>(null);

  const handelFetchLikesCommentWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `feed/fetch?type=${type}&post-id=${postId}`,
        protected: true,
      },
    ];

    const response = await multipleFetchApi(endPointArr);
    const res = response[0];

    if (res?.success) {
      setData(res?.data);
      setLoading(false);

      const likeCommentArray = res?.data?.map(
        (item: LikesCommentsDataInterface) => item?.id
      );
      setFeedPostData((prevData) =>
        prevData.map((item) =>
          item.id === postId ? { ...item, [type]: likeCommentArray } : item
        )
      );
    } else {
      handelNotification(res, 'top-right');
    }
  }, 100);

  const LikeItem = (data: LikesCommentsDataInterface) => {
    return (
      <div
        className='w-full flex items-center bg-gray-50 gap-3 p-3 px-4 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200'
        key={data?.id}
      >
        <img
          src={data.profile_picture}
          alt={data.full_name}
          className='w-12 h-12 rounded-full object-cover ring-2 ring-gray-100'
        />
        <div className='flex-1'>
          <h3 className='font-semibold text-gray-900'>{data.full_name}</h3>
          <p className='text-sm text-gray-500'>{data.employee_code}</p>
        </div>
        <IoMdHeart className='w-7 h-7 min-w-7 min-h-7 max-h-7 max-w-7 text-rose-500' />
      </div>
    );
  };

  const CommentItem = (data: LikesCommentsDataInterface) => {
    return (
      <div
        className='w-full flex gap-3 p-4 bg-gray-50 rounded-lg border border-gray-400'
        key={data?.id}
      >
        <img
          src={data.profile_picture}
          alt={data.full_name}
          className='w-10 h-10 rounded-full object-cover flex-shrink-0'
        />
        <div className='flex-1'>
          <div className='flex items-center gap-2 mb-1'>
            <h3 className='font-semibold text-gray-900'>{data.full_name}</h3>
            <span className='text-xs text-gray-500'>
              ({data.employee_code})
            </span>
          </div>
          <p className='text-gray-700 mb-2'>{data?.comment}</p>
          <button
            // onClick={onReply}
            className='text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1'
          >
            <LuMessageCircleReply className='w-4 h-4' />
            Reply
          </button>
        </div>
      </div>
    );
  };

  const LoadingSkeleton = () => {
    return (
      <div className='space-y-4 overflow-auto w-full h-full'>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className='flex gap-3 p-4 bg-white rounded-lg border border-gray-200 animate-pulse'
          >
            <div className='w-10 h-10 bg-gray-200 rounded-full flex-shrink-0'></div>
            <div className='flex-1 space-y-2'>
              <div className='h-4 bg-gray-200 rounded w-1/3'></div>
              <div className='h-3 bg-gray-200 rounded w-1/4'></div>
              <div className='h-3 bg-gray-200 rounded w-full'></div>
              <div className='h-3 bg-gray-200 rounded w-5/6'></div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  const EmptyState = (type: 'comments' | 'likes') => {
    return (
      <div className='flex flex-col items-center justify-center py-12 px-4 w-full h-full'>
        <div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4'>
          {type === 'comments' ? (
            <LuMessageCircleReply className='w-8 h-8 text-gray-400' />
          ) : (
            <IoMdHeart className='w-8 h-8 text-gray-400' />
          )}
        </div>
        <h3 className='text-lg font-semibold text-gray-900 mb-1'>
          No {type} yet
        </h3>
        <p className='text-gray-500 text-center max-w-sm'>
          {type === 'comments'
            ? 'Be the first to share your thoughts on this post.'
            : 'Be the first to show your appreciation for this post.'}
        </p>
      </div>
    );
  };
  useEffect(() => {
    if (type && postId !== '') {
      handelFetchLikesCommentWithDebounce();
    }
  }, [postId, type]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalBoxRef.current &&
        !modalBoxRef.current.contains(event.target as Node)
      ) {
        handelCancelButton();
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handelCancelButton, showModal]);

  useEffect(() => {
    if (showModal) {
      setIsMounted(true);
      setTimeout(() => {
        setIsVisible(true);
      }, 50);
    } else {
      setTimeout(() => {
        setIsVisible(false);
      }, 50);
      setTimeout(() => {
        setIsMounted(false);
      }, 500);
    }
  }, [showModal]);

  if (!isMounted) return null;
  if (isMounted)
    return (
      <div
        className={classNames(
          'absolute bottom-0 left-0 bg-black/50 w-full h-full z-40 backdrop-blur-sm flex items-end justify-end transition-all duration-500',
          {
            'pointer-events-auto opacity-100 visible': isVisible,
            'pointer-events-none opacity-0 invisible': !isVisible,
          }
        )}
      >
        <div
          className={classNames(
            'w-[calc(100%-8px)] mx-auto h-full max-h-[70%] bg-white rounded-t-3xl transition-all duration-300 overflow-hidden',
            {
              'translate-y-full opacity-0 invisible': !isVisible,
              'translate-y-0 opacity-100 visible': isVisible,
            }
          )}
          ref={modalBoxRef}
        >
          <div className='w-full h-full flex flex-col items-start justify-start gap-3 overflow-y-auto hide-scrollbar'>
            <div className='w-full flex flex-col items-center justify-center border-b border-b-black/10 px-5 pt-3 sticky top-0 left-0 z-20 bg-white rounded-t-3xl'>
              <span className='block w-16 h-1 rounded-full bg-gray-300'></span>
              <p className='font-inter text-black font-semibold text-lg py-3 capitalize'>
                {type}
              </p>
            </div>
            <div className='w-full px-4 pt-2 pb-5 grow'>
              {loading ? (
                LoadingSkeleton()
              ) : (
                <div className='w-full h-full flex flex-col items-start justify-start gap-2'>
                  {data?.length > 0 ? (
                    <>
                      {data?.map((item) =>
                        type == 'comments' ? CommentItem(item) : LikeItem(item)
                      )}
                    </>
                  ) : (
                    EmptyState(type)
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}

export default LikesCommentModal;
