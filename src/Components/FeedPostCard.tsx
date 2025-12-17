import React, { useEffect, useRef, useState } from 'react';

import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { IoChatbubbleOutline } from 'react-icons/io5';
import { MdVerified } from 'react-icons/md';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Button from '../common/Button';
import Loader from '../common/Loader';
import TextArea from '../common/TextArea';
import { classNames, formateDate } from '../Helper/HelperFunctions';
import { FeedPostDataPropsInterface } from '../interface/Dashboard';
import {
  GlobalContextStore,
  PermissionsModuleInterface,
} from '../interface/UserProfileInterface';
import EmployeeProfilePicture from './EmployeeProfilePicture';

interface propsInterface {
  data: FeedPostDataPropsInterface;
  GlobalStateProvider: GlobalContextStore;
  editPostHandler: (feedData: FeedPostDataPropsInterface) => void;
  handelClickOnDeleteButton: (id: string) => void;
  handelClickOnLikeToggle: (post_id: string) => void;
  submitCommentOnClick: (
    post_id: string,
    data: string,
    callback: () => void
  ) => void;
  handelClickOnLikesComments: (
    data: FeedPostDataPropsInterface,
    type: 'comments' | 'likes'
  ) => void;
  permissionData: PermissionsModuleInterface;
}

function FeedPostCard(props: propsInterface) {
  const {
    data,
    GlobalStateProvider,
    editPostHandler,
    handelClickOnDeleteButton,
    handelClickOnLikeToggle,
    submitCommentOnClick,
    handelClickOnLikesComments,
    permissionData,
  } = props;
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const postWrapperDivRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const [showMenu, setShowMenu] = useState(false);
  const [showCommentField, setShowCommentField] = useState<string>('');
  const [commentData, setCommentData] = useState<string>('');
  const [showPicker, setShowPicker] = useState(false);
  const [position, setPosition] = useState('bottom');
  const [loading, setLoading] = useState<boolean>(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const postActionButtonsRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleContextMenu: React.MouseEventHandler<HTMLImageElement> = (e) => {
    e.preventDefault(); // Disable right-click
  };

  const handleDragStart: React.DragEventHandler<HTMLImageElement> = (e) => {
    e.preventDefault(); // Disable dragging
  };

  const handelClickOnEditPost = (feedData: FeedPostDataPropsInterface) => {
    editPostHandler(feedData);
    setShowMenu(false);
  };

  const handelClickOnEmoji = (data: EmojiClickData) => {
    setShowPicker(false);
    setCommentData((pervData) => `${pervData} ${data.emoji}`);
  };

  const renderPostEditButton = () => {
    return (
      <li className='w-full'>
        <Button
          type='button'
          className='px-3 w-full py-2 text-black text-nowrap border-b border-b-black/15 hover:bg-gray-50 text-start'
          onClick={() => handelClickOnEditPost(data)}
        >
          Edit Post
        </Button>
      </li>
    );
  };

  const renderPostDeleteButton = () => {
    return (
      <li className='w-full'>
        <Button
          type='button'
          className='px-3 w-full py-2 text-black text-nowrap border-b border-b-black/15 hover:bg-gray-50 text-start'
          onClick={() => handelClickOnDeleteButton(data?.id)}
        >
          Delete Post
        </Button>
      </li>
    );
  };

  useEffect(() => {
    const handelClickOutSideTheBox = (event: MouseEvent) => {
      if (
        postWrapperDivRef.current &&
        !postWrapperDivRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handelClickOutSideTheBox);

    return () => {
      document.addEventListener('mouseup', handelClickOutSideTheBox);
    };
  }, [setShowMenu]);

  useEffect(() => {
    if (showPicker && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const pickerHeight = 300;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Decide where to show based on space
      if (spaceBelow < pickerHeight && spaceAbove > pickerHeight) {
        setPosition('top');
      } else {
        setPosition('bottom');
      }
    }
  }, [showPicker]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        postActionButtonsRef.current &&
        !postActionButtonsRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const handelClickOutSide = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handelClickOutSide);

    return () => {
      document.addEventListener('mousedown', handelClickOutSide);
    };
  }, [emojiPickerRef]);

  const hasPotEditAccess =
    permissionData?.is_active &&
    permissionData?.permissions?.some(
      (item) => item.label == 'edit' && item.is_allowed
    );

  const hasPostDeleteAccess =
    permissionData?.is_active &&
    permissionData?.permissions?.some(
      (item) => item.label == 'delete' && item.is_allowed
    );

  return (
    <div
      className='w-full border border-black/10 border-b-0 rounded-lg'
      ref={postWrapperDivRef}
    >
      <div className='w-full flex items-center justify-between px-3.5 py-2 bg-[var(--main-white-color)] border-b border-b-black/10 rounded-t-lg'>
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
              <>
                {data?.source_type == 'announcement_team' ? (
                  <span className='text-black flex items-center justify-start text-sm font-semibold gap-1.5'>
                    <span className='block'>{data?.publisher?.full_name}</span>
                    <MdVerified className='text-sm text-blue-700' />
                  </span>
                ) : (
                  <Link
                    to={`/${GlobalStateProvider?.organization?.general_info?.portal_slug}/employees/employee-profile/${data?.publisher?.id}/employee-details`}
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
              </>
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

        {data?.source_type !== 'announcement_team' && (
          <>
            {' '}
            {(data?.publisher?.id ==
              GlobalStateProvider?.user?.employee_info?.user_id ||
              hasPostDeleteAccess ||
              hasPotEditAccess) && (
              <div className='relative' ref={postActionButtonsRef}>
                <button onClick={toggleMenu} className='text-black'>
                  <BsThreeDotsVertical />
                </button>

                {showMenu && (
                  <ul
                    className={classNames(
                      'flex flex-col items-start justify-start bg-white shadow-xl absolute top-full z-10 rounded overflow-hidden right-0 transition-all border border-black/15',
                      { 'opacity-0': !showMenu, 'opacity-100': showMenu }
                    )}
                  >
                    {data?.publisher?.id ==
                    GlobalStateProvider?.user?.personal_info?.user_id
                      ? renderPostEditButton()
                      : hasPotEditAccess
                        ? renderPostEditButton()
                        : null}
                    {data?.publisher?.id ==
                    GlobalStateProvider?.user?.personal_info?.user_id
                      ? renderPostDeleteButton()
                      : hasPostDeleteAccess
                        ? renderPostDeleteButton()
                        : null}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <div className='w-full h-fit'>
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
                          loading='lazy'
                          onContextMenu={handleContextMenu}
                          onDragStart={handleDragStart}
                          draggable={false}
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
          className={classNames('px-3.5 pt-4 pb-5 text-black', {
            'pt-3.5': JSON.parse(data?.images)?.length == 0,
          })}
        >
          <div dangerouslySetInnerHTML={{ __html: data?.description }}></div>
        </div>
      </div>

      <div
        className={classNames(
          'w-full h-fit flex items-center justify-between border-b border-b-black/10 rounded-b-lg',
          {
            'bg-[var(--main-white-color)] px-3.5 py-2':
              !data?.isLikeDisabled || !data?.isCommentDisabled,
          }
        )}
      >
        <div className='w-full h-fit flex flex-col items-center gap-4'>
          <div className='w-full h-fit flex items-center gap-4'>
            {!data?.isLikeDisabled && (
              <div className='flex items-center justify-start gap-1'>
                <button onClick={() => handelClickOnLikeToggle(data?.id)}>
                  {data?.likes?.includes(
                    GlobalStateProvider?.user?.personal_info?.user_id
                  ) ? (
                    <IoMdHeart className='w-7 h-7 min-w-7 min-h-7 max-h-7 max-w-7 text-rose-500' />
                  ) : (
                    <IoMdHeartEmpty className='w-7 h-7 min-w-7 min-h-7 max-h-7 max-w-7 text-gray-600' />
                  )}
                </button>
                <button
                  className='text-black font-semibold font-inter text-base hover:text-blue-600'
                  onClick={() => {
                    setCommentData('');
                    setShowCommentField('');
                    handelClickOnLikesComments(data, 'likes');
                  }}
                >
                  {data?.likes?.length || 0}
                </button>
              </div>
            )}
            {!data?.isCommentDisabled && (
              <div className='flex items-center justify-start gap-1'>
                <button
                  onClick={() =>
                    setShowCommentField(
                      showCommentField?.trim() == '' ? data?.id : ''
                    )
                  }
                >
                  <IoChatbubbleOutline className='w-6 h-6 min-w-6 min-h-6 max-h-6 max-w-6 text-gray-600' />
                </button>
                <button
                  className='text-black font-semibold font-inter text-base hover:text-blue-600'
                  onClick={() => {
                    setCommentData('');
                    setShowCommentField('');
                    handelClickOnLikesComments(data, 'comments');
                  }}
                >
                  {data?.comments?.length || 0}
                </button>
              </div>
            )}
          </div>
          {showCommentField == data?.id && (
            <div className='w-full'>
              <div className='border border-black/45 rounded-lg'>
                <div className='flex items-center justify-between pb-1.5 pt-2 px-2 border-b border-b-black/45'>
                  <span className='font-inter text-black text-sm'>
                    Write Your Thoughts...
                  </span>

                  <div className='relative'>
                    <button
                      ref={buttonRef}
                      onClick={() => setShowPicker((prev) => !prev)}
                    >
                      😄
                    </button>

                    {showPicker && (
                      <div
                        ref={emojiPickerRef}
                        className={`absolute z-50 ${
                          position === 'bottom'
                            ? 'top-full mt-2'
                            : 'bottom-full mb-2'
                        } -right-full`}
                      >
                        <EmojiPicker
                          height={350}
                          theme={Theme.DARK}
                          allowExpandReactions={false}
                          previewConfig={{ showPreview: false }}
                          skinTonesDisabled
                          categories={[]}
                          width={300}
                          lazyLoadEmojis
                          onEmojiClick={handelClickOnEmoji}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <TextArea
                  name='Comment'
                  rows={4}
                  value={commentData}
                  setValue={setCommentData}
                  isRequiredField={true}
                  className='border-0 !outline-none'
                />
              </div>
              <div className='flex items-center justify-end gap-2 pt-3'>
                <Button
                  type='button'
                  className='border border-black/45 px-3 py-1.5 text-black rounded-lg text-base'
                  onClick={() => {
                    setCommentData('');
                    setShowCommentField('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type='button'
                  className='text-white bg-[var(--them-green-color)] hover:bg-[var(--them-green-light-color)] px-3 py-1.5 rounded-lg font-inter text-base transition-all'
                  disabled={loading}
                  onClick={() => {
                    setLoading(true);
                    submitCommentOnClick(data?.id, commentData, () => {
                      setShowCommentField('');
                      setCommentData('');
                      setLoading(false);
                    });
                  }}
                >
                  {loading ? <Loader loaderText='submitting...' /> : 'Submit'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedPostCard;
