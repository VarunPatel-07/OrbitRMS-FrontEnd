/* eslint-disable @typescript-eslint/no-explicit-any */

import { MdDelete, MdModeEdit } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';

import { Column } from '@/interface/ComponentProps.interface';
import { LocationConfigDataInterface } from '@/interface/OrganizationSettings.interface';
import {
  GlobalContextStore,
  PermissionsModuleInterface,
} from '@/interface/UserProfile.interface';

import Button from '@/components/common/Button';
import { formateDate } from '@/utils/helpers/commonHelpers';

export const LocationConfigColumns = ({
  GlobalStateProvider,
  permissionData,
  handelEditButtonClick,
  handelClickOnDeleteButton,
}: {
  GlobalStateProvider: GlobalContextStore;
  permissionData: PermissionsModuleInterface | undefined;
  handelEditButtonClick: (data: LocationConfigDataInterface) => void;
  handelClickOnDeleteButton: (data: LocationConfigDataInterface) => void;
}): Array<Column> => [
  {
    key: 'location_name',
    title: 'Location Name',
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
    key: 'allowed_radius_meters',
    title: 'Allowed Radius',
    isSortable: true,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (data: string) => (
      <span className='w-fit font-inter text-sm font-medium inline-block text-nowrap text-ellipsis overflow-hidden max-w-[300px]'>
        {data} Meter
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
    renderContent: (data: string, childKeyData: string) => {
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
    renderContent: (data: LocationConfigDataInterface) => {
      return (
        <div className='w-full h-full flex items-center justify-start gap-2'>
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
          <Button
            type='button'
            className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
            data-tooltip-id='holiday_delete_button'
            data-tooltip-content='Delete'
            disabled={permissionData?.permissions?.some(
              (item) => item.label == 'delete' && !item.is_allowed
            )}
            onClick={() => handelClickOnDeleteButton(data)}
          >
            <MdDelete className='text-[22px]' />
          </Button>

          <Tooltip
            id='holiday_edit_button'
            opacity={'100'}
            className='z-[15] bg-white'
            place='left'
          />
          <Tooltip
            id='holiday_delete_button'
            opacity={'100'}
            className='z-[15] bg-white'
            place='left'
          />
        </div>
      );
    },
  },
];
