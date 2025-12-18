import { useContext, useEffect, useRef, useState } from 'react';

import { FiLoader } from 'react-icons/fi';
import { IoMdHeart } from 'react-icons/io';
import { LuMessageCircleReply } from 'react-icons/lu';

import { Editor } from '@tiptap/react';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';

import Button from '../../common/Button';
import Loader from '../../common/Loader';
import RichTextEditor from '../../common/RichTextEditor/RichTextEditor';
// import TextArea from '../../common/TextArea';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../Context/Notification/NotificationContextApi';
import {
  endpointObject,
  multipleFetchApi,
  multiplePutApi,
} from '../../Helper/api/multipleAPI';
import {
  classNames,
  getDataFromLocalStorage,
} from '../../Helper/HelperFunctions';
import { useDebounce } from '../../Hooks/useDebounce';
import {
  LikesCommentsDataInterface,
  LikesCommentsModalInterface,
} from '../../interface/Dashboard';

function LikesCommentModal(props: LikesCommentsModalInterface) {
  const {
    type,
    showModal,
    handelCancelButton,
    postId,
    setFeedPostData,

    GlobalStateProvider,
  } = props;

  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const [isVisible, setIsVisible] = useState<boolean>(showModal);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<LikesCommentsDataInterface[]>([]);
  const [commentData, setCommentData] = useState<string>('');
  const [showCommentField, setShowCommentField] = useState<string>('');
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [addCommentLoader, setAddCommentLoader] = useState<boolean>(false);
  const [renderCommentRepliesId, setRenderCommentRepliesId] =
    useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [loadingMoreReplies, setLoadingMoreReplies] = useState<boolean>(false);
  const useEffectRef = useRef(false);
  const modalBoxRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor | null>(null);

  const handelFetchLikesCommentWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `feed/fetch?type=${type}&post-id=${postId}&page=${page}&limit=2`,
        protected: true,
      },
    ];

    const response = await multipleFetchApi(endPointArr);
    const res = response[0];

    if (res?.success) {
      if (type == 'likes') {
        setData(res?.data?.likes);
        setFeedPostData((prevData) =>
          prevData.map((item) =>
            item.id === postId
              ? { ...item, [type]: res?.data?.total_likes }
              : item
          )
        );
      } else {
        setData(res?.data?.comments);
        setFeedPostData((prevData) =>
          prevData.map((item) =>
            item.id === postId
              ? { ...item, [type]: res?.data?.total_comments }
              : item
          )
        );
      }
      setLoading(false);
    } else {
      handelNotification(res, 'top-right');
    }
  }, 100);

  const handelFetchMoreRepliesWithDebounce = useDebounce(
    async (page: number, comment_id: string, post_id: string) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: `feed/fetch-replies?post-id=${post_id}&comment-id=${comment_id}&page=${page}&limit=2`,
          protected: true,
        },
      ];

      const response = await multipleFetchApi(endPointArr);
      const res = response[0];

      if (res?.success) {
        setData((pervData) =>
          pervData?.map((item) =>
            item.id === comment_id
              ? {
                  ...item,
                  replies: [...(item.replies || []), ...(res?.data || [])],
                }
              : item
          )
        );
        setLoadingMoreReplies(false);
      } else {
        handelNotification(res, 'top-right');
      }
      setLoadingMoreReplies(false);
    },
    200
  );

  const handelLoadMoreReplies = (comment_id: string, post_id: string) => {
    setLoadingMoreReplies(true);
    const _page = page;
    setPage(_page + 1);
    handelFetchMoreRepliesWithDebounce(_page + 1, comment_id, post_id);
  };

  const localStorageData = getDataFromLocalStorage('organization-info');
  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug ||
    JSON.parse(localStorageData)?.portal_slug;

  const handelClickOnEmoji = (data: EmojiClickData) => {
    setShowPicker(false);
    setCommentData((pervData) => `${pervData} ${data.emoji}`);
  };

  const handelOnUpdateFunction = (data: string) => {
    setCommentData(data);
  };
  const handelClickOnReplayButton = (data: LikesCommentsDataInterface) => {
    setShowCommentField(showCommentField?.trim() == '' ? data?.id : '');
    setCommentData(
      (pervData) =>
        `<a class="text-blue-600 font-bold pl-1" target="_blank" href=${`/${organization}/employees/employee-profile/${data?.user_id}/employee-details`} contenteditable="false">@${data?.full_name}</a> <span>${pervData || '   '}</span> `
    );
  };

  const submitCommentOnClick = async (comment_id: string, comment: string) => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `feed/comment/replay/toggle?post-id=${postId}&comment-id=${comment_id}`,
        protected: true,
        data: { comment: comment },
      },
    ];

    const response = await multiplePutApi(endPointArr);
    const res = response[0];
    if (res?.success) {
      setShowCommentField('');
      setCommentData('');
      setAddCommentLoader(false);
      handelFetchLikesCommentWithDebounce();
    }
  };

  const handleEditorReady = (editor: Editor) => {
    editorRef.current = editor;
  };

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
        className='w-full flex flex-col gap-3 rounded-lg px-3 py-2'
        key={data?.id}
      >
        <div className='w-full flex items-center justify-start gap-3'>
          <img
            src={data.profile_picture}
            alt={data.full_name}
            className='w-12 h-12 rounded-full object-cover flex-shrink-0'
          />
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-1'>
              <h3 className='font-semibold text-gray-900'>{data.full_name}</h3>
              <span className='text-xs text-gray-500'>
                ({data.employee_code})
              </span>
            </div>
            <p
              className='text-gray-700 mb-2 text-sm'
              dangerouslySetInnerHTML={{ __html: data?.comment }}
            ></p>
            <div className='w-full flex items-center justify-start gap-3.5'>
              <Button
                type='button'
                onClick={() => handelClickOnReplayButton(data)}
                className='text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1'
              >
                <span className='flex items-center justify-start gap-0.5'>
                  <LuMessageCircleReply className='w-4 h-4' />
                  Reply
                </span>
              </Button>
              {data?.replies?.length > 0 && (
                <>
                  {renderCommentRepliesId == data?.id && (
                    <Button
                      type='button'
                      onClick={() => setRenderCommentRepliesId(data?.id)}
                      className='text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1'
                    >
                      <span className='flex items-center justify-start gap-0.5 capitalize'>
                        <span className='h-[1px] w-3 flex bg-gray-500'></span>
                        view replies
                      </span>
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
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
                      className={`absolute z-50 -right-full mr-12 -mt-[200px]`}
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

              <RichTextEditor
                name='text-editor'
                isRequiredField
                classNames='!border-0 !rounded-none'
                GlobalStateProvider={GlobalStateProvider}
                handelOnUpdateFunction={handelOnUpdateFunction}
                // showError={showError}
                onEditorReady={handleEditorReady}
                // errorMessage={
                //   showError
                //     ? isRichTextEditorIsEmpty(formData?.description)
                //       ? 'This Is An Required Field'
                //       : ''
                //     : ''
                // }
                feedContent={commentData}
                className='whitespace-pre-wrap'
                height={100}
                showMenuBar={false}
              />
            </div>
            <div className='flex items-center justify-end gap-2 pt-3'>
              <Button
                type='button'
                className='border border-black/45 px-3 py-1.5 text-black rounded-lg text-base'
                onClick={() => {
                  setShowCommentField('');
                  setCommentData('');
                }}
              >
                Cancel
              </Button>
              <Button
                type='button'
                className='text-white bg-[var(--them-green-color)] hover:bg-[var(--them-green-light-color)] px-3 py-1.5 rounded-lg font-inter text-base transition-all'
                disabled={loading}
                onClick={() => {
                  setAddCommentLoader(true);
                  submitCommentOnClick(data?.id, commentData);
                }}
              >
                {addCommentLoader ? (
                  <Loader loaderText='submitting...' />
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </div>
        )}
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
    if (showModal && !useEffectRef.current) {
      useEffectRef.current = true;

      if (type && postId !== '') {
        handelFetchLikesCommentWithDebounce();
      }
    }
    if (!showModal && useEffectRef.current) {
      useEffectRef.current = false;
    }
  }, [showModal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalBoxRef.current &&
        !modalBoxRef.current.contains(event.target as Node)
      ) {
        handelCancelButton();
        setShowCommentField('');
        setCommentData('');
        setPage(1);
        setLoadingMoreReplies(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handelCancelButton, showModal]);

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
                <div className='w-full h-full flex flex-col items-start justify-start gap-3'>
                  {data?.length > 0 ? (
                    <>
                      {data?.map((item) =>
                        type == 'comments' ? (
                          <div className='w-full flex flex-col items-start justify-start gap-3'>
                            {CommentItem(item)}
                            <div className='w-full flex flex-col items-start justify-start gap-3 pl-10'>
                              {item?.replies?.map((data) => CommentItem(data))}
                              {page < item?.metadata?.total_pages && (
                                <Button
                                  type='button'
                                  onClick={() =>
                                    handelLoadMoreReplies(item?.id, postId)
                                  }
                                  className='text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1 pl-10'
                                >
                                  {loadingMoreReplies ? (
                                    <FiLoader className='min-w-5 min-h-5 animate-spin text-black' />
                                  ) : (
                                    <span className='flex items-center justify-start gap-0.5 capitalize'>
                                      <span className='h-[1px] w-3 flex bg-gray-500'></span>
                                      load more replies
                                    </span>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        ) : (
                          LikeItem(item)
                        )
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
