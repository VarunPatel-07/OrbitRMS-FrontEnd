import { SearchBarFilterOptionsInterface } from '@/interface/ComponentProps.interface';

import {
  Between,
  Is,
  OPTION_TYPE,
} from '@/utils/constants/filterOperators.constants';
import { FilterFieldsTypeEnums } from '@/utils/enums/enums';

export const TEAMS_ORG_LEAVES_SEARCH_FILTER: SearchBarFilterOptionsInterface[] =
  [
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
          label: 'pending',
          value: 'Pending',
          type: FilterFieldsTypeEnums[2],
        },
        {
          label: 'approved',
          value: 'Approved',
          type: FilterFieldsTypeEnums[2],
        },
        {
          label: 'rejected',
          value: 'Rejected',
          type: FilterFieldsTypeEnums[2],
        },
        {
          label: 'cancelled',
          value: 'Cancelled',
          type: FilterFieldsTypeEnums[2],
        },
      ], // No options for text filters
    },
    {
      id: 'date',
      value: 'Date',
      label: (
        <div className='flex items-start'>
          <span className='font-inter text-base text-black font-medium'>
            Date
          </span>
        </div>
      ),
      optionType: OPTION_TYPE.DATE,
      operator: [Is, Between],
      options: [],
    },
  ];
