import { FilterFieldsTypeEnums } from '../../enums/enums';
import { SearchBarFilterOptionsInterface } from '../../interface/propsInterface';

export const clientInquiryFiltersArray: SearchBarFilterOptionsInterface[] = [
  {
    id: 'email',
    value: 'Email',
    label: (
      <div className='flex items-start'>
        <span className='icon-mail-05 text-gray-600 text-lg pe-2' />
        <span>Email</span>
      </div>
    ),
    optionType: 'text',
    operator: [
      {
        label: 'Equals',
        value: 'equals',
        type: FilterFieldsTypeEnums[1],
      },
      {
        label: 'Contains',
        value: 'contains',
        type: FilterFieldsTypeEnums[1],
      },
      {
        label: 'Starts with',
        value: 'starts_with',
        type: FilterFieldsTypeEnums[1],
      },
      {
        label: 'Ends with',
        value: 'ends_with',
        type: FilterFieldsTypeEnums[1],
      },
    ],
    options: [], // No options for text filters
  },
  {
    id: 'name',
    value: 'Name',
    label: (
      <div className='flex items-start'>
        <span>Name</span>
      </div>
    ),
    optionType: 'text',
    operator: [
      {
        label: 'Equals',
        value: 'equals',
        type: FilterFieldsTypeEnums[1],
      },
      {
        label: 'Contains',
        value: 'contains',
        type: FilterFieldsTypeEnums[1],
      },
      {
        label: 'Starts with',
        value: 'starts_with',
        type: FilterFieldsTypeEnums[1],
      },
      {
        label: 'Ends with',
        value: 'ends_with',
        type: FilterFieldsTypeEnums[1],
      },
    ],
    options: [], // No options for text filters
  },
  {
    id: 'status',
    value: 'Status',
    label: (
      <div className='flex items-start'>
        <span className='icon-check-circle text-gray-600 text-lg pe-2' />
        <span>Status</span>
      </div>
    ),
    optionType: 'select',
    operator: [
      {
        label: 'Equals',
        value: 'equals',
        type: FilterFieldsTypeEnums[1],
      },
      {
        label: 'Not Equals',
        value: 'not_equals',
        type: FilterFieldsTypeEnums[1],
      },
    ],
    options: [
      {
        label: 'Open',
        value: 'open',
        type: FilterFieldsTypeEnums[2],
      },
      {
        label: 'Closed',
        value: 'closed',
        type: FilterFieldsTypeEnums[2],
      },
    ],
  },
  {
    id: 'date',
    value: 'Date',
    label: (
      <div className='flex items-start'>
        <span className='icon-calendar text-gray-600 text-lg pe-2' />
        <span>Date</span>
      </div>
    ),
    optionType: 'date',
    operator: [
      {
        label: 'Before',
        value: 'before',
        type: FilterFieldsTypeEnums[1],
      },
      {
        label: 'After',
        value: 'after',
        type: FilterFieldsTypeEnums[1],
      },
      {
        label: 'On',
        value: 'on',
        type: FilterFieldsTypeEnums[1],
      },
      {
        label: 'Between',
        value: 'between',
        type: FilterFieldsTypeEnums[1],
      },
    ],
    options: [], // No predefined options for date filters
  },
  {
    id: 'priority',
    value: 'Priority',
    label: (
      <div className='flex items-start'>
        <span className='icon-flag text-gray-600 text-lg pe-2' />
        <span>Priority</span>
      </div>
    ),
    optionType: 'select',
    operator: [
      {
        label: 'Equals',
        value: 'equals',
        type: FilterFieldsTypeEnums[1],
      },
      {
        label: 'Not Equals',
        value: 'not_equals',
        type: FilterFieldsTypeEnums[1],
      },
    ],
    options: [
      {
        label: 'Low',
        value: 'low',
        type: FilterFieldsTypeEnums[2],
      },
      {
        label: 'Medium',
        value: 'medium',
        type: FilterFieldsTypeEnums[2],
      },
      {
        label: 'High',
        value: 'high',
        type: FilterFieldsTypeEnums[2],
      },
    ],
  },
];
