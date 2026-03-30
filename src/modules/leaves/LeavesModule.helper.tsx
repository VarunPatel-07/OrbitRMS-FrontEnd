import {
  ModuleValueInterface,
  SearchBarFilterOptionsInterface,
} from '@/interface/ComponentProps.interface';
import { LeaveEmployeeData } from '@/interface/LeavesModule.interface';

import { Is, OPTION_TYPE } from '@/utils/constants/filterOperators.constants';
import { FilterFieldsTypeEnums } from '@/utils/enums/enums';

export const AddLeaveTypesInFilterArray = (
  title: string,
  optionsArray: string[]
): SearchBarFilterOptionsInterface => {
  const options = optionsArray?.map((item) => ({
    label: item.toLowerCase(),
    value: item,
    type: FilterFieldsTypeEnums[2],
  }));

  return {
    id: title?.toLocaleLowerCase(),
    value: title,
    label: (
      <div className='flex items-start'>
        <span className='font-inter text-base text-black font-medium'>
          {title}
        </span>
      </div>
    ),
    optionType: OPTION_TYPE.MULTI_SELECT,
    operator: [Is],
    options: options,
  };
};

export const AddEmployeeInSearchFilter = (
  title: string,
  optionsArray: LeaveEmployeeData[]
): SearchBarFilterOptionsInterface => {
  const options: ModuleValueInterface[] = optionsArray?.map((item) => ({
    label: item?.id,
    value: item?.id,
    customLayout: (
      <div className='flex items-start'>
        <span className='font-inter text-sm text-black font-normal capitalize'>
          {item?.full_name}{' '}
          <span className='text-xs text-blue-600'>({item?.employee_code})</span>
        </span>
      </div>
    ),
    type: FilterFieldsTypeEnums[2],
  }));

  return {
    id: title?.toLocaleLowerCase(),
    value: title,
    label: (
      <div className='flex items-start'>
        <span className='font-inter text-base text-black font-medium'>
          {title}
        </span>
      </div>
    ),
    optionType: OPTION_TYPE.MULTI_SELECT,
    operator: [Is],
    options: options,
  };
};
