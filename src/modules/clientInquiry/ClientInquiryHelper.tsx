/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { SetStateAction } from 'react';

import { ClientInquiryFormSchemaInterface } from '@/interface/ClientInquiry.interface';
import {
  Column,
  SearchBarFilterOptionsInterface,
} from '@/interface/ComponentProps.interface';

import {
  Contains,
  EndsWith,
  Equals,
  Is,
  OPTION_TYPE,
  StartsWith,
} from '@/utils/constants/filterOperators.constants';
import { FilterFieldsTypeEnums } from '@/utils/enums/enums';

export const handelGeneratingDynamicClientColumn = (
  columnData: ClientInquiryFormSchemaInterface[],
  setClientInquiryFiltersArray: React.Dispatch<
    SetStateAction<SearchBarFilterOptionsInterface[]>
  >,
  setColumns: React.Dispatch<SetStateAction<Column[]>>
) => {
  const columnsArray: Array<Column> = [];

  const clientFilterArray: SearchBarFilterOptionsInterface[] = [];

  columnData?.map((data: ClientInquiryFormSchemaInterface) => {
    if (['string', 'number'].includes(data?.type)) {
      const columnObject: Column = {
        key: data?.field_name,
        title: data?.field_name
          ?.replace(/_/g, ' ')
          ?.split(' ')
          .map(
            (item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
          )
          ?.join(' '),
        isSortable: true,
        isSticky: false,
        canToggleVisibility: true,
        renderContent: (data: any) => (
          <div className='w-fit'>
            <span className='font-inter text-sm font-medium text-black max-w-[500px] text-wrap line-clamp-3 text-ellipsis overflow-hidden'>
              {data || <span>-</span>}
            </span>
          </div>
        ),
      };
      columnsArray.push(columnObject);
    }
    if (['string', 'number', 'boolean'].includes(data?.type)) {
      const FilterObject: SearchBarFilterOptionsInterface = {
        id: data?.field_name,
        value: data?.field_name
          ?.replace(/_/g, ' ')
          ?.split(' ')
          .map(
            (item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
          )
          ?.join(' '),
        label: (
          <div className='flex items-start'>
            <span className='icon-mail-05 text-gray-600 text-lg pe-2' />
            <span>
              {data?.field_name
                ?.replace(/_/g, ' ')
                ?.split(' ')
                .map(
                  (item) =>
                    item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
                )
                ?.join(' ')}
            </span>
          </div>
        ),
        optionType:
          data?.type == 'boolean' ? OPTION_TYPE.SELECT : OPTION_TYPE.TEXT,
        operator:
          data?.type == 'boolean'
            ? [Is]
            : [Equals, Contains, StartsWith, EndsWith],
        options:
          data?.type == 'boolean'
            ? [
                {
                  label: 'active',
                  value: 'Active',
                  type: FilterFieldsTypeEnums[2],
                },
                {
                  label: 'inactive',
                  value: 'Inactive',
                  type: FilterFieldsTypeEnums[2],
                },
              ]
            : [], // No options for text filters
      };
      clientFilterArray.push(FilterObject);
    }
  });

  setColumns((perValue) => {
    return [...columnsArray, ...perValue];
  });
  setClientInquiryFiltersArray(clientFilterArray);
};
