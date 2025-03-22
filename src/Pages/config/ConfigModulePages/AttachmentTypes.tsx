/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from 'react';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';

import TableInfoHeader from '../../../common/Table/TableInfoHeader';
import AddModal from '../../../Components/Modal/AddModal';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../../Context/Notification/NotificationContextApi';
import {
  endpointObject,
  multiplePostApi,
} from '../../../Helper/api/multipleAPI';
import { formateDate, hexToRgb } from '../../../Helper/HelperFunctions';
import { useDebounce } from '../../../Hooks/useDebounce';
import {
  Column,
  TableInfoHeaderInterfaceButtonArrayObject,
} from '../../../interface/propsInterface';

export default function AttachmentTypes() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('add');
  const [editId, setEditId] = useState<string>('');
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
  const [value, setValue] = useState<string>('');

  const handelShowModal = () => {
    // setShowModal(!showModal);
  };
  const optionsButtonArray: Array<TableInfoHeaderInterfaceButtonArrayObject> = [
    {
      buttonTitle: 'Attachment Types',
      classNames:
        'font-inter text-white font-medium bg-[#3538CD] px-4 py-1.5 text-base rounded-lg',
      onclickFunction: handelShowModal,
    },
  ];

  const handelFormSubmitWithDebounce = useDebounce(
    async (value: string, color?: string) => {
      let endPoint = `config/project_status/add-edit`;

      if (modalType === 'edit') {
        endPoint += `?type=edit&id=${editId}`;
      } else {
        endPoint += `?type=add`;
      }

      const data = {
        status_name: value,
        status_color: color,
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
        // fetchProjectStatus();
        setValue('');
      }
    },
    200
  );

  const handelFormSubmitFunction = (value: string, color?: string) => {
    setLoading(true);
    handelFormSubmitWithDebounce(value, color);
  };

  const columns: Array<Column> = [
    {
      key: 'status_name',
      childKey: 'status_color',
      title: 'Project Status',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: any, childKeyData) => (
        <span
          className='w-fit font-inter text-sm font-medium inline-block px-2.5 py-0.5 rounded-full'
          style={{
            color: childKeyData,
            border: `1px solid ${childKeyData}`,
            backgroundColor: `rgba(${hexToRgb(childKeyData)}, 0.15)`,
          }}
        >
          {data}
        </span>
      ),
    },
    {
      key: 'created_by',
      childKey: 'created_at',
      title: 'Created By',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: any, childKeyData: any) => {
        return data ? (
          <div className='flex flex-col w-full'>
            <span className='w-full font-inter text-sm capitalize font-medium inline-block text-black/70'>{`${JSON.parse(data).first_name} ${JSON.parse(data).last_name}`}</span>
            <span className='w-full font-inter text-sm capitalize font-medium inline-block text-black/70'>
              {formateDate(childKeyData)}
            </span>
          </div>
        ) : (
          <div className='flex flex-col w-full'>
            <span className='w-full font-inter text-sm capitalize font-medium inline-block text-black/70'>
              system
            </span>
            <span className='w-full font-inter text-sm capitalize font-medium inline-block text-black/70'>
              {formateDate(childKeyData)}
            </span>
          </div>
        );
      },
    },
    {
      key: 'updated_by',
      childKey: 'updated_at',
      title: 'Updated By',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: any, childKeyData: any) => {
        return data ? (
          <div className='flex flex-col w-full'>
            <span className='w-full font-inter text-sm capitalize font-medium inline-block text-black/70'>{`${JSON.parse(data).first_name} ${JSON.parse(data).last_name}`}</span>
            <span className='w-full font-inter text-sm capitalize font-medium inline-block text-black/70'>
              {formateDate(childKeyData)}
            </span>
          </div>
        ) : (
          <span>-</span>
        );
      },
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

  return (
    <div className='w-full h-full'>
      <TableInfoHeader
        moduleName='Attachment Types'
        badgeValue={`2`}
        buttonsArray={optionsButtonArray}
      />
      <AddModal
        modalTitle={
          modalType == 'add' ? 'Add Project Status' : 'Edit Project Status'
        }
        labelFieldName='Project Status'
        showColorPicker={true}
        showPreview={true}
        showModal={showModal}
        setShowModal={setShowModal}
        loading={loading}
        handelFormSubmitFunction={handelFormSubmitFunction}
        value={value}
        setValue={setValue}
      />
    </div>
  );
}
