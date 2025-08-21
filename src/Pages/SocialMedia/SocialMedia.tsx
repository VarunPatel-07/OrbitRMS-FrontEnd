import React, { useContext, useEffect, useRef, useState } from 'react';
import { GoAlert } from 'react-icons/go';
import { SkeletonTheme } from 'react-loading-skeleton';
import { useLocation } from 'react-router-dom';

import { AddEditPostFormData } from '../../constant/SocialMediaConstatnt';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../Context/globalState/GlobalStateContectApi';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../Context/Notification/NotificationContextApi';
import {
  endpointObject,
  multipleDeleteApi,
  multipleFetchApi,
  multiplePostApi,
} from '../../Helper/api/multipleAPI';
import { useDebounce } from '../../Hooks/useDebounce';
import {
  AddEditSocialMediaPostFormdataInterface,
  ConnectedSocialMediaAccountInterface,
  SocialMediaPostDataInterface,
} from '../../interface/SocialMediaModule';
import ConnectedPlatforms from './ConnectedPlatforms';
import { GenerateFormDataForSocialMedia } from './SocialMediaModuleHelper/SocialMediaModuleHelper';
import SocialMediaPosts from './SocialMediaPosts';

const DeleteModal = React.lazy(
  () => import('../../Components/Modal/DeleteModal')
);
const AddEditSocialMediaPost = React.lazy(
  () => import('./SocialMediaModuleModal/AddEditSocialMediaPost')
);

const SocialMediaModuleModal = React.lazy(
  () => import('./SocialMediaModuleModal/SocialMediaModuleModal')
);

function SocialMedia() {
  const location = useLocation();

  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const useEffectRef = useRef(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [connectedSocialMediaAccount, setConnectedSocialMediaAccount] =
    useState<ConnectedSocialMediaAccountInterface[]>([]);
  const [
    isLoadingConnectedSocialMediaAccount,
    setIsLoadingConnectedSocialMediaAccount,
  ] = useState<boolean>(true);
  const [handelClickOnDropDown, setHandelClickOnDropDown] =
    useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedAccountArr, setSelectedAccountArr] = useState<string[]>([]);
  const [showAddEditPostModal, setShowAddEditPostModal] =
    useState<boolean>(false);
  const [formSubmitLoading, setFormSubmitLoading] = useState<boolean>(false);
  const [formData, setFormData] =
    useState<AddEditSocialMediaPostFormdataInterface>(AddEditPostFormData);
  const [loadingSocialMediaPost, setLoadingSocialMediaPost] =
    useState<boolean>(true);
  const [socialPostArray, setSocialPostArray] = useState<
    SocialMediaPostDataInterface[]
  >([]);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const [deletePostId, setDeletePostId] = useState<string>('');

  //
  //* This Is The Function That Fetch All The Linked SocialMedia Account
  //
  const fetchSocialMediaAccountWithDebounce = useDebounce(async () => {
    const endpointArr: endpointObject[] = [
      {
        endPoint: 'social/media/accounts/fetch',
        protected: true,
      },
    ];
    const response = await multipleFetchApi(endpointArr);
    const res = response[0];
    if (res?.success) {
      setConnectedSocialMediaAccount(res?.data);
      setSelectedAccountArr(
        res?.data?.map(
          (item: ConnectedSocialMediaAccountInterface) => item?.platform
        )
      );
    } else {
      handelNotification(res, 'top-right');
    }
    setIsLoadingConnectedSocialMediaAccount(false);
  }, 100);

  //
  //*  This Is The Function That Handel Adding Of The Social Media Post From OrbitRMS
  //
  const handelAddSocialMediaPostWithDebounce = useDebounce(async () => {
    const multipartFormData = GenerateFormDataForSocialMedia(formData);

    const multipartHeader = {
      'Content-Type': 'multipart/form-data',
    };
    //
    //? End Point Array That Hold All The APi End Point To Fetch. In One Go
    //
    const endpointArr: endpointObject[] = [
      {
        endPoint: 'social/media/accounts/post/add',
        protected: true,
        data: multipartFormData,
        header: multipartHeader,
      },
    ];

    const response = await multiplePostApi(endpointArr);

    const res = response[0];

    if (res?.success) {
      setLoadingSocialMediaPost(true);
      setShowAddEditPostModal(false);
      handelFetchSocialMediaPostWithDebounce();
      setFormData(AddEditPostFormData);
    } else {
      handelNotification(res, 'top-right');
    }

    setFormSubmitLoading(false);
  }, 100);

  //
  //*  This Is The Function That Handel Fetching Of All The Social Media Post
  //
  const handelFetchSocialMediaPostWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      { endPoint: 'social/media/accounts/post/fetch-all', protected: true },
    ];

    const response = await multipleFetchApi(endPointArr);

    const res = response[0];

    if (res?.success) {
      setSocialPostArray(res?.data);
    } else {
      handelNotification(res, 'top-right');
    }

    setLoadingSocialMediaPost(false);
  }, 100);

  //
  //*  This Is The Function That Handel Deleting Of All The Social Media Post
  //
  const handelDeleteSocialMediaPostWithDebounce = useDebounce(
    async (deletePostId: string) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: `social/media/accounts/post/delete?id=${deletePostId}`,
          protected: true,
        },
      ];

      const response = await multipleDeleteApi(endPointArr);

      const res = response[0];
      setIsDeleteLoading(false);
      setShowDeleteModal(false);
      handelNotification(res, 'top-right');

      if (res?.success) {
        setLoadingSocialMediaPost(true);
        handelFetchSocialMediaPostWithDebounce();
      }
    },
    100
  );
  const ExtraErrorMessageRender = () => {
    return (
      <div className='w-full max-w-[640px] flex items-start gap-3 rounded-xl border border-red-600 bg-red-50 p-4'>
        <GoAlert className='text-red-600 w-5 h-5 mt-0.5' />
        <div className='flex-1'>
          <p className='text-sm font-medium text-red-700'>
            Instagram Deletion Not Allowed
          </p>
          <p className='mt-1 text-sm text-red-600 leading-relaxed'>
            Deleting published{' '}
            <span className='font-semibold text-red-800'>Instagram</span> posts
            via third-party apps is{' '}
            <span className='font-semibold'>not permitted</span> under the
            official{' '}
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media_publish'
              className='underline text-red-700 hover:text-red-800 font-semibold'
            >
              Meta Graph API
            </a>
            . Please remove the post directly using the Instagram app.
          </p>
        </div>
      </div>
    );
  };

  console.log(loadingSocialMediaPost);

  const handelCancelButton = () => {
    setShowAddEditPostModal(false);
    setFormData(AddEditPostFormData);
  };

  const handelClickOnDeleteButton = (postId: string) => {
    if (postId) {
      setDeletePostId(postId);
      setShowDeleteModal(true);
    }
  };

  const handelDeletePost = () => {
    if (deletePostId) {
      setIsDeleteLoading(true);
      handelDeleteSocialMediaPostWithDebounce(deletePostId);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!handelClickOnDropDown) return;

      const ref = dropdownRefs.current[handelClickOnDropDown];
      if (ref && !ref.contains(event.target as Node)) {
        setHandelClickOnDropDown('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handelClickOnDropDown]);

  useEffect(() => {
    if (location.hash == '#_=_') {
      window.history.replaceState(null, '', ' '); // Remove the hash
    }
  }, [location]);

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    fetchSocialMediaAccountWithDebounce();
    handelFetchSocialMediaPostWithDebounce();
  }, []);

  return (
    <>
      <SkeletonTheme baseColor='#dcdce3' highlightColor='#ebebeb'>
        <div className='w-full h-full max-h-[calc(100vh-60px)] overflow-auto hide-scrollbar'>
          <div className='w-full h-full flex flex-col items-start justify-start p-5 gap-6'>
            <ConnectedPlatforms
              GlobalStateProvider={GlobalStateProvider}
              data={connectedSocialMediaAccount}
              dropdownRefs={dropdownRefs}
              loading={isLoadingConnectedSocialMediaAccount}
              handelClickOnDropDown={handelClickOnDropDown}
              setShowModal={setShowModal}
              showModal={showModal}
              setHandelClickOnDropDown={setHandelClickOnDropDown}
            />
            <SocialMediaPosts
              setShowAddEditPostModal={setShowAddEditPostModal}
              socialPostArray={socialPostArray}
              handelClickOnDeleteButton={handelClickOnDeleteButton}
            />
          </div>
        </div>
      </SkeletonTheme>

      <SocialMediaModuleModal
        showModal={showModal}
        setShowModal={setShowModal}
        GlobalStateProvider={GlobalStateProvider}
        selectedAccountArr={selectedAccountArr}
      />
      <AddEditSocialMediaPost
        showModal={showAddEditPostModal}
        handelOnSubmit={handelAddSocialMediaPostWithDebounce}
        handelCancelButton={handelCancelButton}
        loading={formSubmitLoading}
        setLoading={setFormSubmitLoading}
        formData={formData}
        setFormData={setFormData}
        selectedAccountArr={selectedAccountArr}
      />
      <DeleteModal
        loading={isDeleteLoading}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handelDelete={handelDeletePost}
        name='Social Media Post'
        ExtraErrorMessage={ExtraErrorMessageRender()}
        minHeight={400}
      />
    </>
  );
}

export default SocialMedia;
