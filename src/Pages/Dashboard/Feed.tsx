import React, { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { FaPenToSquare } from 'react-icons/fa6';

import EmptyFeedAnimation from '../../Components/Animation/EmptyFeedAnimation';
import FeedPostCard from '../../Components/FeedPostCard';
import FeedPostLoader from '../../Components/Loader/FeedPostLoader';
import UploadingPostDefaultLoader from '../../Components/Loader/UploadingPostDefaultLoader';
import {
  FeedPostDataPropsInterface,
  OrganizationFeedPropsInterface,
} from '../../interface/Dashboard';
import LikesCommentModal from './LikesCommentModal';

const CTAButton = ({
  setShowAddEditPostModal,
}: {
  setShowAddEditPostModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <button
      className='font-inter text-white font-medium bg-[var(--them-green-color)] px-3 py-1 text-base rounded-md flex items-center justify-between gap-2'
      onClick={() => setShowAddEditPostModal(true)}
    >
      <FaPenToSquare />
      <span>Create Post</span>
    </button>
  );
};

function Feed(props: OrganizationFeedPropsInterface) {
  const {
    setShowAddEditPostModal,
    feedPostData,
    GlobalStateProvider,
    loading,
    editPostHandler,
    handelClickOnDeleteButton,
    handelClickOnLikeToggle,
    likedPosts,
    submitCommentOnClick,
    stage,
    progress,
    uploadingPostFormData,
    permissionData,
    setFeedPostData,
  } = props;
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'comments' | 'likes'>('likes');
  const [postId, setPostId] = useState<string>('');

  const handelClickOnLikesComments = (
    data: FeedPostDataPropsInterface,
    type: 'comments' | 'likes'
  ) => {
    setModalType(type);
    setShowModal(true);
    setPostId(data?.id);
  };

  const handelCancelButton = () => {
    setShowModal(false);
    setTimeout(() => {
      setModalType('likes');
      setPostId('');
    }, 150);
  };
  return (
    <div className='w-full h-full relative'>
      <div className='w-full bg-white relative flex flex-col items-start justify-start max-h-[calc(100vh-56px)] h-full overflow-auto hide-scrollbar'>
        {/* Header Section */}
        <div className='w-full  flex items-stretch justify-between px-3.5 py-3 border-b border-b-black/15 min-h-[60px] h-[60px] sticky top-0 left-0 bg-white z-20'>
          <p className='text-xl text-black font-inter font-semibold flex flex-col items-center justify-center'>
            Feed
          </p>
          <div className='flex items-stretch justify-end gap-2'>
            {!permissionData ||
            !permissionData?.is_active ||
            !permissionData?.permissions?.some(
              (item) => item.label == 'view' && item.is_allowed
            ) ? null : (
              <CTAButton setShowAddEditPostModal={setShowAddEditPostModal} />
            )}

            <button className='text-black text-base px-3 border border-black/15 rounded-md hover:bg-gray-100'>
              <FaFilter className='text-sm' />
            </button>
          </div>
        </div>
        {loading ? (
          <FeedPostLoader />
        ) : (
          <>
            {(uploadingPostFormData?.description !== '' ||
              uploadingPostFormData?.new_images?.length > 0 ||
              uploadingPostFormData?.existing_images?.length > 0) && (
              <UploadingPostDefaultLoader progress={progress} stage={stage} />
            )}

            {feedPostData?.length == 0 ? (
              <EmptyFeedAnimation
                CTAButton={
                  <CTAButton
                    setShowAddEditPostModal={setShowAddEditPostModal}
                  />
                }
              />
            ) : (
              <div className='w-full h-full grow'>
                <div className='w-full flex flex-col items-start justify-start gap-4 px-4 py-4'>
                  {feedPostData?.map((item) => {
                    return (
                      <div key={item?.id} className='w-full'>
                        <FeedPostCard
                          data={item}
                          likedPosts={likedPosts}
                          GlobalStateProvider={GlobalStateProvider}
                          editPostHandler={editPostHandler}
                          handelClickOnDeleteButton={handelClickOnDeleteButton}
                          handelClickOnLikeToggle={handelClickOnLikeToggle}
                          submitCommentOnClick={submitCommentOnClick}
                          handelClickOnLikesComments={
                            handelClickOnLikesComments
                          }
                          permissionData={permissionData}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <LikesCommentModal
        type={modalType}
        showModal={showModal}
        postId={postId}
        handelCancelButton={handelCancelButton}
        setFeedPostData={setFeedPostData}
      />
    </div>
  );
}

export default Feed;
