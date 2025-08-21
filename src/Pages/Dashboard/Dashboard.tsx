import React, { useContext, useEffect, useRef, useState } from 'react';
import { MdOutlineDashboard } from 'react-icons/md';
import { Editor } from '@tiptap/react';

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
  multiplePutApi,
} from '../../Helper/api/multipleAPI';
import { generateTimeBasedGreeting } from '../../Helper/HelperFunctions';
import { useDebounce } from '../../Hooks/useDebounce';
import { useMentionSearchDebounce } from '../../Hooks/useMentionSearchDebounce';
import {
  AddEditPostFormdataInterface,
  FeedPostDataPropsInterface,
} from '../../interface/Dashboard';
import { OrganizationHolidays } from '../../interface/OrganizationSettings';
import { RichTextEditorApiResponseInterface } from '../../interface/propsInterface';
import DashboardPlayground from './DashboardPlayground';
import Feed from './Feed';

const AddEditPostModal = React.lazy(
  () => import('../../Components/Modal/AddEditPostModal')
);

const DeleteModal = React.lazy(
  () => import('../../Components/Modal/DeleteModal')
);

const initialData: AddEditPostFormdataInterface = {
  description: '',
  new_images: [],
  isCommentDisabled: false,
  isLikeDisabled: false,
  existing_images: [],
  likes: [],
};

function Dashboard() {
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const useEffectReference = useRef(false);

  const editorRef = useRef<Editor | null>(null);

  const [holidayData, setHolidayData] = useState<OrganizationHolidays[]>([]);
  const [showAddEditPostModal, setShowAddEditPostModal] =
    useState<boolean>(false);

  const [feedPostData, setFeedPostData] = useState<
    FeedPostDataPropsInterface[]
  >([]);

  const [formData, setFormData] =
    useState<AddEditPostFormdataInterface>(initialData);
  const [formSubmitLoader, setFormSubmitLoader] = useState<boolean>(false);
  const [feedPostLoader, setFeedPostLoader] = useState<boolean>(true);
  const [editPostId, setEditPostId] = useState<string>('');
  const [type, setType] = useState<'add' | 'edit'>('add');
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deletePostId, setDeletePostId] = useState<string>('');
  const [isLoadingHoliday, setIsLoadingHoliday] = useState<boolean>(true);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  //
  //
  // * The Api That Help To Delete a Specific Post
  //
  //
  //
  const deletePostWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `feed/delete-post?id=${deletePostId}`,
        protected: true,
      },
    ];
    const response = await multipleDeleteApi(endPointArr);
    const res = response[0];
    setIsDeleteLoading(false);

    if (res?.success) {
      setFeedPostLoader(true);
      setDeletePostId('');
      setShowDeleteModal(false);
      fetchTheFeedPostsWithDebounce();
    } else {
      handelNotification(res, 'top-right');
    }
  }, 100);

  const handelClickOnDeleteButton = (id: string) => {
    setDeletePostId(id);
    setShowDeleteModal(true);
  };

  const handelToggleLikeWithDebounce = useDebounce(async (post_id: string) => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `feed/like/toggle?post-id=${post_id}`,
        protected: true,
      },
    ];
    const response = await multiplePutApi(endPointArr);
    const res = response[0];
    setIsDeleteLoading(false);

    if (res?.success) {
      if (res?.data?.liked && res?.data?.action == 'like') {
        const likedPostArray = [...likedPosts].filter(
          (item) => item?.trim() !== post_id
        );

        setLikedPosts(likedPostArray);

        setFeedPostData((pervData) => {
          return pervData?.map((data) =>
            data?.id === post_id
              ? {
                  ...data,
                  likes: [
                    ...data.likes,
                    GlobalStateProvider?.user?.personal_info?.user_id,
                  ],
                }
              : data
          );
        });
      } else if (!res?.data?.liked && res?.data?.action == 'unlike') {
        const likedPostArray = [...likedPosts].filter(
          (item) => item?.trim() !== post_id
        );

        setLikedPosts(likedPostArray);

        setFeedPostData((pervData) => {
          return pervData?.map((data) =>
            data?.id === post_id
              ? {
                  ...data,
                  likes: [...data.likes].filter(
                    (item) =>
                      item?.trim() !==
                      GlobalStateProvider?.user?.personal_info?.user_id
                  ),
                }
              : data
          );
        });
      }
    } else {
      handelNotification(res, 'top-right');
    }
  }, 100);

  const handelAddCommentWithDebounce = useDebounce(
    async (post_id: string, data: string, callback: () => void) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: `feed/comment/toggle?post-id=${post_id}`,
          protected: true,
          data: { comment: data },
        },
      ];
      const response = await multiplePutApi(endPointArr);
      const res = response[0];
      setIsDeleteLoading(false);

      if (res?.success) {
        setFeedPostData((pervData) => {
          return pervData?.map((data) =>
            data?.id === post_id
              ? {
                  ...data,
                  comments: [
                    ...data.comments,
                    {
                      comment: res?.data?.comment,
                      id: '',
                      is_replay: res?.data?.is_replay,
                      organization_update_id: res?.data?.post_id,
                      user_id: res?.data?.user_id,
                    },
                  ],
                }
              : data
          );
        });
      } else {
        handelNotification(res, 'top-right');
      }
      callback();
    },
    100
  );

  const handelClickOnLikeToggle = (post_id: string) => {
    setLikedPosts((pervData) => [...pervData, post_id]);
    handelToggleLikeWithDebounce(post_id);
  };

  const submitCommentOnClick = (
    post_id: string,
    data: string,
    callback: () => void
  ) => {
    handelAddCommentWithDebounce(post_id, data, callback);
  };

  //
  //
  // * The Api That Help To Fetch The Post Data
  //
  //
  //
  const fetchTheFeedPostsWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `feed/fetch-post?order=desc&field_name=created_at`,
        protected: true,
      },
    ];
    const response = await multipleFetchApi(endPointArr);
    const res = response[0];

    if (res?.success) {
      setFeedPostData(res?.data);
    } else {
      handelNotification(res, 'top-right');
    }
    setFeedPostLoader(false);
    setType('add');
    setEditPostId('');
  }, 100);

  //
  //
  //* The Api That Help To Fetch The Initial Data Like Data For The Holiday Card
  //
  //
  //

  const fetchInitialDataWithDebounce = useDebounce(async () => {
    const date = new Date();
    const current_year = date.getFullYear();
    const endPointArr: endpointObject[] = [
      {
        endPoint: `org-setting/holiday/fetch?year=${current_year}&order=desc&field_name=date`,
        protected: true,
      },
    ];

    const response = await multipleFetchApi(endPointArr);
    const res = response[0];

    if (res?.success) {
      setHolidayData(res?.data);
    } else {
      handelNotification(res, 'top-right');
    }
    setIsLoadingHoliday(false);
  }, 100);
  const handelApiCallingFunction = useMentionSearchDebounce(
    async (query: string) => {
      const response = await multipleFetchApi([
        {
          endPoint: `employee/fetch-employee?query=${query}`,
          protected: true,
        },
      ]);

      if (!response[0]?.success) throw new Error('Failed to fetch');

      const data = await response[0]?.data;

      if (data?.length !== 0) {
        return data.map((item: RichTextEditorApiResponseInterface) => ({
          id: item.id,
          label: `${item?.full_name ? item?.full_name : item?.first_name + ' ' + item?.middle_name + ' ' + item?.last_name}`,
          employeeCode: `(<span className="text-blue-600">${item?.employee_code}</span>)`,
          success: true,
        }));
      } else {
        return [
          {
            id: '',
            label: '',
            employeeCode: '',
            success: false,
            message: 'No matches found.',
          },
        ];
      }
    },
    400
  );
  //
  //
  //* The Api That Help To Post The Feed As Well As For The Editing
  //
  //
  //

  const handelSubmitApiCallingWithDebounce = useDebounce(async () => {
    const multipartFormData = new FormData();
    multipartFormData.append('description', formData.description);
    formData?.new_images?.map((item) => {
      multipartFormData.append('new_images', item?.file);
    });
    formData.existing_images?.map((item) => {
      multipartFormData.append('existing_images', item);
    });

    multipartFormData.append(
      'isCommentDisabled',
      String(formData.isCommentDisabled)
    );
    multipartFormData.append('isLikeDisabled', String(formData.isLikeDisabled));
    const multipartHeader = {
      'Content-Type': 'multipart/form-data',
    };

    const endPointArr: endpointObject[] = [
      {
        endPoint:
          type == 'add'
            ? `feed/add-edit?type=${type}`
            : `feed/add-edit?type=${type}&id=${editPostId}`,
        protected: true,
        data: multipartFormData,
        header: multipartHeader,
      },
    ];

    const response = await multiplePostApi(endPointArr);
    const res = response[0];
    handelNotification(res, 'top-right');
    setFormSubmitLoader(false);
    if (res?.success) {
      setShowAddEditPostModal(false);
      setFormData(initialData);
      editorRef.current?.commands.clearContent();
      setFeedPostLoader(true);
      fetchTheFeedPostsWithDebounce();
    }
  }, 100);

  const editPostHandler = (feedData: FeedPostDataPropsInterface) => {
    setType('edit');
    setEditPostId(feedData?.id);
    setShowAddEditPostModal(true);
    setFormData({
      description: feedData?.description,
      existing_images: feedData?.images ? JSON.parse(feedData?.images) : [],
      isCommentDisabled: feedData?.isCommentDisabled,
      isLikeDisabled: feedData?.isLikeDisabled,
      new_images: [],
      likes: [],
    });
  };

  const handleEditorReady = (editor: Editor) => {
    editorRef.current = editor;
  };

  const handelCancelButton = () => {
    setShowAddEditPostModal(false);
    setFormData(initialData);
  };

  const handelDeleteItem = () => {
    setIsDeleteLoading(true);
    deletePostWithDebounce();
  };

  useEffect(() => {
    if (useEffectReference.current) return;
    useEffectReference.current = true;
    fetchInitialDataWithDebounce();
    fetchTheFeedPostsWithDebounce();
  }, [fetchInitialDataWithDebounce, fetchTheFeedPostsWithDebounce]);

  return (
    <>
      <div className='w-full h-full bg-[var(--main-white-color)] overflow-hidden'>
        <div className='w-full h-full flex items-stretch justify-between overflow-hidden'>
          <div className='flex-grow w-1/2'>
            <div className='w-full  flex items-stretch justify-between px-3.5 py-3 border-b border-b-black/15 h-[60px] bg-white'>
              <p className='text-base text-wrap text-black font-inter font-semibold flex items-center justify-start gap-1'>
                <span>{generateTimeBasedGreeting()},</span>
                <span>
                  {GlobalStateProvider?.user?.personal_info?.full_name
                    ? GlobalStateProvider?.user?.personal_info?.full_name
                    : GlobalStateProvider?.user?.personal_info?.first_name +
                      ' ' +
                      GlobalStateProvider?.user?.personal_info?.middle_name +
                      ' ' +
                      GlobalStateProvider?.user?.personal_info?.last_name}
                </span>
              </p>
              <button className='text-black text-base px-2 border border-black/15 rounded-md hover:bg-gray-100'>
                <MdOutlineDashboard className='text-2xl' />
              </button>
            </div>
            <DashboardPlayground
              holidayData={holidayData}
              GlobalStateProvider={GlobalStateProvider}
              isLoadingHoliday={isLoadingHoliday}
            />
          </div>
          <div className='w-1/2 max-w-[500px] bg-white min-w-[200px] h-full border-l border-l-black/15'>
            <Feed
              setShowAddEditPostModal={setShowAddEditPostModal}
              feedPostData={feedPostData}
              GlobalStateProvider={GlobalStateProvider}
              loading={feedPostLoader}
              editPostHandler={editPostHandler}
              handelClickOnDeleteButton={handelClickOnDeleteButton}
              handelClickOnLikeToggle={handelClickOnLikeToggle}
              likedPosts={likedPosts}
              submitCommentOnClick={submitCommentOnClick}
            />
          </div>
        </div>
      </div>
      <AddEditPostModal
        showAddEditPostModal={showAddEditPostModal}
        GlobalStateProvider={GlobalStateProvider}
        handelOnSubmit={handelSubmitApiCallingWithDebounce}
        onEditorReady={handleEditorReady}
        formData={formData}
        setFormData={setFormData}
        loading={formSubmitLoader}
        setLoading={setFormSubmitLoader}
        handelCancelButton={handelCancelButton}
        handelApiCallingFunction={handelApiCallingFunction}
      />
      <DeleteModal
        loading={isDeleteLoading}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handelDelete={handelDeleteItem}
        name='Post'
      />
    </>
  );
}

export default Dashboard;
