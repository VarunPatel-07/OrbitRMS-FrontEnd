import { SearchBarFilterOptionsInterface } from '@/interface/ComponentProps.interface';

import {
  Contains,
  EndsWith,
  Equals,
  Is,
  OPTION_TYPE,
  StartsWith,
} from '@/utils/constants/filterOperators.constants';
import { FilterFieldsTypeEnums } from '@/utils/enums/enums';

export const ClientInquiryFilterArray: SearchBarFilterOptionsInterface[] = [
  {
    id: 'form_id',
    value: 'Form Id',
    label: (
      <div className='flex items-start'>
        <span className='icon-mail-05 text-gray-600 text-sm pe-2' />
        <span className='font-inter text-base text-black font-medium'>
          Form Id
        </span>
      </div>
    ),
    optionType: OPTION_TYPE.TEXT,
    operator: [Equals, Contains, StartsWith, EndsWith],
    options: [], // No options for text filters
  },
  {
    id: 'form_name',
    value: 'Form Name',
    label: (
      <div className='flex items-start'>
        <span className='font-inter text-base text-black font-medium'>
          Form Name
        </span>
      </div>
    ),
    optionType: OPTION_TYPE.SELECT,
    operator: [Equals, Contains, StartsWith, EndsWith],
    options: [],
  },

  {
    id: 'status',
    value: 'Status',
    label: (
      <div className='flex items-start'>
        <span className='font-inter text-base text-black font-medium'>
          Status
        </span>
      </div>
    ),
    optionType: OPTION_TYPE.SELECT,
    operator: [Is],
    options: [
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
    ], // No options for text filters
  },
];
