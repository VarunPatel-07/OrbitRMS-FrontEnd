/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { SetStateAction } from 'react';

import { MdModeEdit, MdOutlineRemoveRedEye } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';

import { Column } from '@/interface/ComponentProps.interface';
import { LeavesTypesInterface } from '@/interface/OrganizationSettings.interface';
import {
  GlobalContextStore,
  PermissionsModuleInterface,
} from '@/interface/UserProfile.interface';

import Button from '@/components/common/Button';
import { formateDate } from '@/utils/helpers/commonHelpers';

export const LeavesManagerColumn = ({
  GlobalStateProvider,
  showViewModal,
  permissionData,
  setShowViewModal,
  setLeaveData,
  handelEditButtonClick,
}: {
  GlobalStateProvider: GlobalContextStore;
  showViewModal: boolean;
  permissionData: PermissionsModuleInterface | undefined;
  setShowViewModal: React.Dispatch<SetStateAction<boolean>>;
  setLeaveData: React.Dispatch<SetStateAction<LeavesTypesInterface>>;
  handelEditButtonClick: (data: LeavesTypesInterface) => void;
}): Array<Column> => [
  {
    key: 'leave_name',
    title: 'Leave Name',
    isSortable: true,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (data: string) => (
      <span className='w-fit font-inter text-sm font-medium inline-block text-nowrap text-ellipsis overflow-hidden max-w-[300px]'>
        {data}
      </span>
    ),
  },
  {
    key: 'leave_code',
    title: 'Leave Code',
    isSortable: true,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (data: string) => (
      <span className='w-fit font-inter font-medium inline-block text-nowrap text-ellipsis overflow-hidden px-3 py-1 pb-0.5 bg-cyan-100 text-cyan-800 border border-cyan-600 rounded-xl text-xs'>
        {data}
      </span>
    ),
  },
  {
    key: 'max_number_of_leave',
    title: 'Total Number Of Leave',
    isSortable: true,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (data: string) => (
      <span className='w-fit font-inter text-sm font-medium inline-block'>
        {data}
      </span>
    ),
  },
  {
    key: 'refill_quarterly',
    title: 'Quarterly Refill',
    isSortable: true,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (data: boolean) => (
      <>
        {data ? (
          <span className='text-green-600 capitalize font-semibold text-sm border border-green-600 px-6 py-1.5 rounded-full bg-green-50 font-inter'>
            active
          </span>
        ) : (
          <span className='text-red-600 capitalize font-semibold text-sm border border-red-600 px-6 py-1.5 rounded-full bg-red-50 font-inter'>
            in Active
          </span>
        )}
      </>
    ),
  },
  {
    key: 'refill_from',
    title: 'Refill From',
    isSortable: true,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (data: string) => (
      <span className='text-black capitalize font-semibold text-sm px-2.5 py-1.5 rounded-lg bg-black/10 font-inter'>
        {data}
      </span>
    ),
  },
  {
    key: 'status',
    title: 'Status',
    isSortable: true,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (data: boolean) => (
      <>
        {data ? (
          <span className='text-green-600 capitalize font-semibold text-sm border border-green-600 px-6 py-1.5 rounded-full bg-green-50 font-inter'>
            active
          </span>
        ) : (
          <span className='text-red-600 capitalize font-semibold text-sm border border-red-600 px-6 py-1.5 rounded-full bg-red-50 font-inter'>
            in Active
          </span>
        )}
      </>
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
            {formateDate(
              childKeyData,
              GlobalStateProvider?.organization?.organization_settings
                ?.default_dateformat
            )}
          </span>
        </div>
      ) : (
        <div className='flex flex-col w-full'>
          <span className='w-full font-inter text-sm capitalize font-medium inline-block text-black/70'>
            system
          </span>
          <span className='w-full font-inter text-sm capitalize font-medium inline-block text-black/70'>
            {formateDate(
              childKeyData,
              GlobalStateProvider?.organization?.organization_settings
                ?.default_dateformat
            )}
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
            {formateDate(
              childKeyData,
              GlobalStateProvider?.organization?.organization_settings
                ?.default_dateformat
            )}
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
    isSticky: true,
    canToggleVisibility: true,
    renderContent: (data: LeavesTypesInterface) => {
      return (
        <div className='w-full h-full flex items-center justify-start gap-2'>
          <Button
            type='button'
            className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
            data-tooltip-id='roles_permission_view_button'
            data-tooltip-content='View'
            onClick={() => {
              setShowViewModal(!showViewModal);
              setLeaveData(data);
            }}
            //   disabled={
            //     permissions &&
            //     permissions.some(
            //       (perm) => perm.label === 'view' && !perm.is_allowed
            //     )
            //   }
          >
            <MdOutlineRemoveRedEye className='text-[22px]' />
          </Button>
          <Button
            type='button'
            className='text-black/80 p-1.5'
            data-tooltip-id='holiday_edit_button'
            data-tooltip-content='Edit'
            onClick={() => handelEditButtonClick(data)}
            disabled={permissionData?.permissions?.some(
              (item) => item.label == 'edit' && !item.is_allowed
            )}
          >
            <MdModeEdit className='text-[22px]' />
          </Button>

          <Tooltip
            id='holiday_edit_button'
            opacity={'100'}
            className='z-[15] bg-white'
            place='left'
          />
        </div>
      );
    },
  },
];
