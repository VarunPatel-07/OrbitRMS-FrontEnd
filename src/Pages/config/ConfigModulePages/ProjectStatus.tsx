/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useRef, useState } from 'react';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';

import Table from '../../../common/Table/Table';
import TableInfoHeader from '../../../common/Table/TableInfoHeader';
import TableSkeletonLoader from '../../../Components/Loader/Table/TableSkeletonLoader';
import AddModal from '../../../Components/Modal/AddModal';
import DeleteModal from '../../../Components/Modal/DeleteModal';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../../Context/Notification/NotificationContextApi';
import {
  endpointObject,
  multipleFetchApi,
  multiplePostApi,
} from '../../../Helper/api/multipleAPI';
import { useDebounce } from '../../../Hooks/useDebounce';
import { TableInfoHeaderInterfaceButtonArrayObject } from '../../../interface/propsInterface';

function ProjectStatus() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;
  const useEffectRef = useRef(false);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('add');
  const [data, setData] = useState([]);
  const [value, setValue] = useState<string>('');
  const [editId, setEditId] = useState<string>('');
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<string>('');

  const handelShowModal = () => {
    setShowModal(!showModal);
  };

  const handelFormSubmitWithDebounce = useDebounce(
    async (value: string, bgColor?: string) => {
      let endPoint = `config/project_status/add-edit`;

      if (modalType === 'edit') {
        endPoint += `?type=edit&id=${editId}`;
      } else {
        endPoint += `?type=add`;
      }

      const data = {
        status_name: value,
        bgColor: bgColor,
      };

      const endPointArr: Array<endpointObject> = [
        {
          endPoint: endPoint,
          protected: true,
          data,
        },
      ];

      const response = await multiplePostApi(endPointArr);
      const res = response[0];
      if (res?.success) {
        setLoading(false);
        setShowModal(false);
        setIsFetchingData(true);
        handelNotification(res, 'top-right');
        fetchProjectStatus();
        setValue('');
      }
    },
    200
  );

  const handelFormSubmitFunction = (value: string, bgColor?: string) => {
    setLoading(true);
    handelFormSubmitWithDebounce(value, bgColor);
  };

  const handelDeleteItemWithDebounce = useDebounce(async () => {
    try {
      const response = await multiplePostApi([
        {
          endPoint: `config/project_status/delete?id=${deleteItemId}`,
          protected: true,
        },
      ]);

      const res = response[0];
      if (res?.success) {
        setShowDeleteModal(false);
        setIsDeleteLoading(false);
        setIsFetchingData(true);
        handelNotification(res, 'top-right');
        fetchProjectStatus();
      }
    } catch (error) {
      console.error('Error fetching project status:', error);
    }
  }, 300);

  const handelDeleteItem = () => {
    setIsDeleteLoading(true);
    handelDeleteItemWithDebounce();
  };

  const fetchProjectStatus = useDebounce(async () => {
    try {
      const response = await multipleFetchApi([
        { endPoint: 'config/project_status/fetch', protected: true },
      ]);

      const res = response[0];
      if (res?.success) {
        setData(res?.data);
        setIsFetchingData(false);
      }
    } catch (error) {
      console.error('Error fetching project status:', error);
    }
  }, 200);

  const handelEditButtonClick = (data: any) => {
    setShowModal(true);
    setModalType('edit');
    setValue(data?.status_name);
    setEditId(data?.id);
  };

  const optionsButtonArray: Array<TableInfoHeaderInterfaceButtonArrayObject> = [
    {
      buttonTitle: 'Add Project Status',
      classNames:
        'font-inter text-white font-medium bg-[#3538CD] px-4 py-1.5 text-base rounded-lg',
      onclickFunction: handelShowModal,
    },
  ];

  const columns = [
    {
      key: 'status_name',
      title: 'Project Status',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: any) => <span>{data}</span>,
    },
    {
      key: 'action',
      title: 'Action',
      isSortable: false,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: any) => {
        return (
          <div className='w-full h-full flex items-center justify-start gap-2'>
            <button
              className='text-black/85 p-1.5'
              data-tooltip-id='project_status_edit_button'
              data-tooltip-content='Edit'
              onClick={() => handelEditButtonClick(data)}
            >
              <MdModeEdit className='text-[22px]' />
            </button>
            <button
              className='text-black/85 p-1.5'
              data-tooltip-id='project_status_delete_button'
              data-tooltip-content='Delete'
              onClick={() => {
                setShowDeleteModal(true);
                setDeleteItemId(data?.id);
              }}
            >
              <MdDelete className='text-[22px]' />
            </button>
            <Tooltip
              id='project_status_edit_button'
              opacity={'100'}
              className='z-[15] bg-white'
              place='left'
            />
            <Tooltip
              id='project_status_delete_button'
              opacity={'100'}
              className='z-[15] bg-white'
              place='left'
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    setIsFetchingData(true);
    fetchProjectStatus();
  }, []);

  return (
    <>
      <div className='w-full h-full'>
        {isFetchingData ? (
          <div className='w-full h-full overflow-hidden'>
            <TableSkeletonLoader
              tableHeaderCount={4}
              tableValueCount={13}
              maxHeight='calc(-300px + 100vh)'
            />
          </div>
        ) : (
          <>
            <TableInfoHeader
              moduleName='Project Status'
              badgeValue='3'
              buttonsArray={optionsButtonArray}
            />
            {data?.length >= 0 && (
              <Table
                columns={columns}
                data={data}
                tableWrapperClass={
                  'overflow-auto max-h-[calc(100vh-170px)] rounded-b-lg'
                }
                stickyHeaderClass='sticky top-0'
              />
            )}
          </>
        )}
      </div>

      <AddModal
        modalTitle={
          modalType == 'add' ? 'Add Project Status' : 'Edit Project Status'
        }
        labelFieldName='Project Status'
        showColorPicker={false}
        showPreview={false}
        showModal={showModal}
        setShowModal={setShowModal}
        loading={loading}
        handelFormSubmitFunction={handelFormSubmitFunction}
        value={value}
        setValue={setValue}
      />
      <DeleteModal
        loading={isDeleteLoading}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handelDelete={handelDeleteItem}
      />
    </>
  );
}

export default ProjectStatus;
