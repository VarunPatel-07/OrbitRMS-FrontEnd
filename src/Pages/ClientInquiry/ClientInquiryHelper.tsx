/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { SetStateAction } from 'react';

import {
  Contains,
  EndsWith,
  Equals,
  Is,
  StartsWith,
} from '../../constant/FilterOperator';
import { FilterFieldsTypeEnums } from '../../enums/enums';
import { ClientInquiryFormSchemaInterface } from '../../interface/ClientInquiryInterFace';
import {
  Column,
  SearchBarFilterOptionsInterface,
} from '../../interface/propsInterface';

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
        optionType: data?.type == 'boolean' ? 'select' : 'text',
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
    return [...perValue.slice(0, 2), ...columnsArray, ...perValue.slice(2)];
  });
  setClientInquiryFiltersArray(clientFilterArray);
};
