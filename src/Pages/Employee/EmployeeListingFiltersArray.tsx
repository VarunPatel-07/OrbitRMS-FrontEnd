import {
  Contains,
  EndsWith,
  Equals,
  Is,
  StartsWith,
} from '../../constant/FilterOperator';
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
    operator: [Equals, Contains, StartsWith, EndsWith],
    options: [], // No options for text filters
  },
  {
    id: 'account_status',
    value: 'Account Status',
    label: (
      <div className='flex items-start'>
        <span className='font-inter text-base text-black font-medium'>
          Account Status
        </span>
      </div>
    ),
    optionType: 'select',
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
        label: 'intern',
        value: 'Intern',
        type: FilterFieldsTypeEnums[2],
      },
      {
        label: 'trainee',
        value: 'Trainee',
        type: FilterFieldsTypeEnums[2],
      },
      {
        label: 'probation',
        value: 'Probation',
        type: FilterFieldsTypeEnums[2],
      },
      {
        label: 'confirmed',
        value: 'Confirmed',
        type: FilterFieldsTypeEnums[2],
      },
    ], // No options for text filters
  },
  {
    id: 'employee_type',
    value: 'Employee Type',
    label: (
      <div className='flex items-start'>
        <span className='font-inter text-base text-black font-medium'>
          Employee Type
        </span>
      </div>
    ),
    optionType: 'multi-select',
    operator: [Equals],
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
      {
        label: 'support',
        value: 'Support',
        type: FilterFieldsTypeEnums[2],
      },
      {
        label: 'management',
        value: 'Management',
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
    operator: [Equals, Contains, StartsWith, EndsWith],
    options: [], // No options for text filters
  },
];
