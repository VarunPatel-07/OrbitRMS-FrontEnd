/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { GoAlert } from 'react-icons/go';
import { SkeletonTheme } from 'react-loading-skeleton';
import { useLocation } from 'react-router-dom';
import * as tus from 'tus-js-client';

import UploadingPostDefaultLoader from '../../Components/Loader/UploadingPostDefaultLoader';
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
import { getCroppedImageBlob } from '../../Helper/ImageCropper';
import { ImageDownscaler } from '../../Helper/ImageDownscaler';
import { useDebounce } from '../../Hooks/useDebounce';
import { cloudSignDataInterface } from '../../interface/Dashboard';
import { CloudinaryUploadResult } from '../../interface/interface';
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
  const [uploadingPostFormData, setUploadingPostFormData] =
    useState<AddEditSocialMediaPostFormdataInterface>(AddEditPostFormData);
  const [stage, setStage] = useState<
    'parsing' | 'uploading' | 'processing' | 'done'
  >('parsing');
  const [progress, setProgress] = useState(0);

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

  const handelUploadPostWithDebounce = useDebounce(
    async (
      data: AddEditSocialMediaPostFormdataInterface,
      uploadImages: [{ type: 'image' | 'video'; url: string }]
    ) => {
      const multipartFormData = GenerateFormDataForSocialMedia(
        data,
        uploadImages
      );

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
        setTimeout(() => {
          setUploadingPostFormData(AddEditPostFormData);
        }, 500);
        setTimeout(() => {
          // setLoadingSocialMediaPost(true);
          handelFetchSocialMediaPostWithDebounce();
        }, 800);
        handelFetchSocialMediaPostWithDebounce();
      } else {
        handelNotification(res, 'top-right');
      }

      setFormSubmitLoading(false);
    },
    100
  );
  const CLOUDINARY_UPLOAD_URL = (cloudName: string) =>
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  // -------------------------------
  // VIDEO UPLOAD FUNCTION (TUS)
  // -------------------------------
  const uploadVideoUsingTUS = (
    file: File,
    { cloud_name }: cloudSignDataInterface,
    onProgress: (bytesUploaded: number, bytesTotal: number) => void
  ) => {
    return new Promise((resolve, reject) => {
      const uploadData = new tus.Upload(file, {
        endpoint: CLOUDINARY_UPLOAD_URL(cloud_name),
        metadata: {
          filename: file.name,
          filetype: file.type,
        },
        uploadDataDuringCreation: true,
        chunkSize: 5 * 1024 * 1024,
        retryDelays: [0, 1000, 3000, 5000],
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        onError: (error) => {
          console.error('Upload failed:', error);
          reject(error);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          onProgress(bytesUploaded, bytesTotal);
        },
        onSuccess: () => {
          // console.log('Upload finished:', uploadData.url);
          resolve(uploadData.url);
        },
      });
      uploadData.start();
    });
  };
  // -------------------------------
  // IMAGE UPLOAD FUNCTION
  // -------------------------------
  const uploadImageToCloudinary = (
    file: File,
    { cloud_name, api_key, signature, time_stamp }: cloudSignDataInterface,
    onProgress: (bytesUploaded: number, bytesTotal: number) => void
  ) => {
    const url = CLOUDINARY_UPLOAD_URL(cloud_name);
    const formData = new FormData();

    formData.append('file', file);
    formData.append('api_key', api_key);
    formData.append('timestamp', String(time_stamp));
    formData.append('signature', signature);
    formData.append('resource_type', 'auto');

    return new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(e.loaded, e.total);
        }
      };
      xhr.onerror = () => reject(new Error('Upload failed'));
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else reject(new Error(`Upload failed: ${xhr.status}`));
      };
      xhr.send(formData);
    });
  };
  const uploadImageVideoToCloud = async (
    data: AddEditSocialMediaPostFormdataInterface,
    cloudSignData: cloudSignDataInterface
  ) => {
    setStage('parsing');
    const { time_stamp, signature, api_key, cloud_name } = cloudSignData;

    const allFiles = [
      ...(data?.new_images || []).map((i) => i?.originalFile),
    ].filter(Boolean) as File[];

    const totalBytes = allFiles.reduce((acc, f) => acc + f.size, 0);
    let uploadedBytes = 0;

    const handleProgress = (bytesUploaded: number) => {
      const totalProgress =
        ((uploadedBytes + bytesUploaded) / totalBytes) * 100;

      console.log(totalProgress);

      setProgress(totalProgress);
    };

    const uploadedMedia: any[] = [];
    for (const item of data?.new_images || []) {
      const file = item?.originalFile;
      if (!file) return;

      const isVideo = file.type.startsWith('video');

      if (isVideo) {
        setStage('uploading');

        const uploadedUrl = await uploadVideoUsingTUS(
          file,
          {
            cloud_name,
            api_key,
            signature,
            time_stamp,
          },
          handleProgress
        );
        uploadedBytes += file.size;
        uploadedMedia.push({ url: uploadedUrl, type: 'video' });
      } else {
        setStage('uploading');

        let processedFile: File;
        if (file.size > 10 * 1024 * 1024) {
          processedFile = await ImageDownscaler(file, 10);
        } else {
          processedFile = file;
        }

        const blob = await getCroppedImageBlob(
          processedFile,
          item.croppedArea,
          item?.rotation
        );

        processedFile = new File([blob], file.name, { type: file.type });

        const uploadedUrl = await uploadImageToCloudinary(
          processedFile,
          {
            cloud_name,
            api_key,
            signature,
            time_stamp,
          },
          handleProgress
        );

        uploadedBytes += file.size;

        if (uploadedUrl) {
          uploadedMedia.push({
            url: uploadedUrl.secure_url,
            type: uploadedUrl.resource_type || 'image',
          });
        }
      }
      for (const img of data?.existing_images || []) {
        uploadedMedia.push({ url: img, type: 'image' });
      }
    }

    return uploadedMedia;
  };
  const handelAddSocialMediaPostWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: 'upload/cloud/signature',
        protected: true,
      },
    ];

    const response = await multiplePostApi(endPointArr);
    const res = response[0];
    if (res?.success) {
      setFormSubmitLoading(false);
      setShowAddEditPostModal(false);
      setStage('parsing');
      setUploadingPostFormData(formData);
      const responseData = await uploadImageVideoToCloud(formData, res.data);
      if (responseData) {
        setStage('processing');

        handelUploadPostWithDebounce(formData, responseData);
      }
      setFormData(AddEditPostFormData);
    }
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
      <div
        className={`w-fit h-fit fixed right-3 bottom-3 z-50 transition-opacity duration-500 ${
          uploadingPostFormData?.caption !== '' ||
          uploadingPostFormData?.new_images?.length > 0 ||
          uploadingPostFormData?.existing_images?.length > 0
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {(uploadingPostFormData?.caption !== '' ||
          uploadingPostFormData?.new_images?.length > 0 ||
          uploadingPostFormData?.existing_images?.length > 0) && (
          <UploadingPostDefaultLoader
            progress={progress}
            stage={stage}
            theme='dark'
          />
        )}
      </div>

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
