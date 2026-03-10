import { Between, Is } from '../../constant/FilterOperator';
import { FilterFieldsTypeEnums } from '../../enums/enums';
import { SearchBarFilterOptionsInterface } from '../../interface/propsInterface';

export const LeavesSearchFilterArray: SearchBarFilterOptionsInterface[] = [
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
    optionType: 'select',
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
    optionType: 'date',
    operator: [Is, Between],
    options: [],
  },
];
