import { FilterFieldsTypeEnums } from '../../enums/enums';
import { SearchBarFilterOptionsInterface } from '../../interface/propsInterface';

export const EmployeeListingFiltersArray: SearchBarFilterOptionsInterface[] = [
  {
    id: 'employee_name',
    value: 'Employee Name',
    label: (
      <div className='flex items-start'>
        <span className='icon-mail-05 text-gray-600 text-sm pe-2' />
        <span className='font-inter text-base text-black font-medium'>
          Employee Name
        </span>
      </div>
    ),
    optionType: 'text',
    operator: [
      {
        label: 'equals',
        value: 'Equals',
        type: FilterFieldsTypeEnums[1],
      },
      {
        label: 'contains',
        value: 'Contains',
        type: FilterFieldsTypeEnums[1],
      },
      {
        label: 'starts_with',
        value: 'Starts With',
        type: FilterFieldsTypeEnums[1],
      },
      {
        label: 'ends_with',
        value: 'Ends With',
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
        <span className='icon-user text-gray-600 text-lg pe-2' />
        <span className='font-inter text-base text-black font-medium'>
          Status
        </span>
      </div>
    ),
    optionType: 'select',
    operator: [
      {
        label: 'equals',
        value: 'Equals',
        type: FilterFieldsTypeEnums[1],
      },
    ],
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
  {
    id: 'employee_type',
    value: 'Employee Type',
    label: (
      <div className='flex items-start'>
        <span className='icon-user text-gray-600 text-lg pe-2' />
        <span className='font-inter text-base text-black font-medium'>
          Employee Type
        </span>
      </div>
    ),
    optionType: 'select',
    operator: [
      {
        label: 'equals',
        value: 'Equals',
        type: FilterFieldsTypeEnums[1],
      },
    ],
    options: [
      {
        label: 'technical',
        value: 'Technical',
        type: FilterFieldsTypeEnums[2],
      },
      {
        label: 'non-technical',
        value: 'Non Technical',
        type: FilterFieldsTypeEnums[2],
      },
    ], // No options for text filters
  },
  {
    id: 'reporting_manager',
    value: 'Reporting Manager',
    label: (
      <div className='flex items-start'>
        <span className='icon-mail-05 text-gray-600 text-sm pe-2' />
        <span className='font-inter text-base text-black font-medium'>
          Reporting Manager
        </span>
      </div>
    ),
    optionType: 'text',
    operator: [
      {
        label: 'equals',
        value: 'Equals',
        type: FilterFieldsTypeEnums[1],
      },
      {
        label: 'contains',
        value: 'Contains',
        type: FilterFieldsTypeEnums[1],
      },
      {
        label: 'starts_with',
        value: 'Starts With',
        type: FilterFieldsTypeEnums[1],
      },
      {
        label: 'ends_with',
        value: 'Ends With',
        type: FilterFieldsTypeEnums[1],
      },
    ],
    options: [], // No options for text filters
  },
];
