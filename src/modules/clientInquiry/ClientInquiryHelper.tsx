import React, { SetStateAction } from 'react';

import { FaRegFile } from 'react-icons/fa';

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
import { verifyURL } from '@/utils/helpers/commonHelpers';

export const handelGeneratingDynamicClientColumn = (
   columnData: ClientInquiryFormSchemaInterface[],
   setClientInquiryFiltersArray: React.Dispatch<
      SetStateAction<SearchBarFilterOptionsInterface[]>
   >,
   setColumns: React.Dispatch<SetStateAction<Column[]>>
) => {
   const columnsArray: Array<Column> = [];

   const clientFilterArray: SearchBarFilterOptionsInterface[] = [];

   columnData?.map((columnData: ClientInquiryFormSchemaInterface) => {
      if (['string', 'number', 'file'].includes(columnData?.type)) {
         const columnObject: Column = {
            key: columnData?.field_name,
            title: columnData?.field_name
               ?.replace(/_/g, ' ')
               ?.split(' ')
               .map(
                  (item) =>
                     item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
               )
               ?.join(' '),
            isSortable: true,
            isSticky: false,
            canToggleVisibility: true,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            renderContent: (data: any) => {
               console.log('test Data', data);
               return (
                  <div className='w-fit'>
                     {columnData?.type === 'file' ? (
                        <>
                           {verifyURL(data) ? (
                              <div className='flex flex-wrap items-center justify-start gap-2'>
                                 {data?.map((item: string) => (
                                    <a
                                       href={String(item)}
                                       target='_blank'
                                       rel='noopener noreferrer'
                                       className='text-black underline break-all p-2 bg-slate-200 rounded'
                                       title={String(item)}
                                       aria-label={String(item)}
                                    >
                                       {<FaRegFile />}
                                    </a>
                                 ))}
                              </div>
                           ) : (
                              <span className='font-inter text-sm font-medium text-black max-w-[500px] text-wrap line-clamp-3 text-ellipsis overflow-hidden'>
                                 -
                              </span>
                           )}
                        </>
                     ) : (
                        <span className='font-inter text-sm font-medium text-black max-w-[500px] text-wrap line-clamp-3 text-ellipsis overflow-hidden'>
                           {data || '-'}
                        </span>
                     )}
                  </div>
               );
            },
         };
         columnsArray.push(columnObject);
      }
      // This is one is for the search bar thing
      if (['string', 'number', 'boolean'].includes(columnData?.type)) {
         const FilterObject: SearchBarFilterOptionsInterface = {
            id: columnData?.field_name,
            value: columnData?.field_name
               ?.replace(/_/g, ' ')
               ?.split(' ')
               .map(
                  (item) =>
                     item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
               )
               ?.join(' '),
            label: (
               <div className='flex items-start'>
                  <span className='icon-mail-05 text-gray-600 text-lg pe-2' />
                  <span>
                     {columnData?.field_name
                        ?.replace(/_/g, ' ')
                        ?.split(' ')
                        .map(
                           (item) =>
                              item.charAt(0).toUpperCase() +
                              item.slice(1).toLowerCase()
                        )
                        ?.join(' ')}
                  </span>
               </div>
            ),
            optionType:
               columnData?.type == 'boolean'
                  ? OPTION_TYPE.SELECT
                  : OPTION_TYPE.TEXT,
            operator:
               columnData?.type == 'boolean'
                  ? [Is]
                  : [Equals, Contains, StartsWith, EndsWith],
            options:
               columnData?.type == 'boolean'
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
