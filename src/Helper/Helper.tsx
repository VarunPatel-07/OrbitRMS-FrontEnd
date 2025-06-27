import React from 'react';

import { OrganizationEmployeeStatusArray } from '../constant/constant';
import { EmployeeStatusInterface } from '../interface/EmployeeInterface';
import { InfoFieldProps } from '../interface/interface';
import { formateDate } from './HelperFunctions';

const AccountStatusColor: Record<string, string> = {
  Intern: 'bg-yellow-500',
  Trainee: 'bg-fuchsia-600',
  Probation: ' bg-indigo-600',
  Confirmed: 'bg-green-500',
};

export const BeautifulAccountStatusRenderer = (
  status: EmployeeStatusInterface
): React.ReactNode => {
  if (OrganizationEmployeeStatusArray.includes(status)) {
    return (
      <span className='border border-black/15 rounded-lg px-2.5 py-1 flex items-center justify-between gap-2 w-fit'>
        <span
          className={`w-2 h-2 inline-block rounded-full ${AccountStatusColor[status]}`}
        ></span>
        <span className='text-sm text-black/60 font-inter font-medium'>
          {status}
        </span>
      </span>
    );
  } else {
    return (
      <span className='text-sm text-black/60 font-inter font-medium'>-</span>
    );
  }
};

export const InfoField = ({
  label,
  value,
  renderDate = false,
  default_dateformat,
  isLink = false,
}: InfoFieldProps) => (
  <div className='w-full'>
    {label?.trim() !== '' && (
      <span className='text-sm lg:text-base font-inter font-medium text-black pb-1 inline-block'>
        {label}
      </span>
    )}

    {isLink && typeof value == 'string' && (
      <a
        href={value}
        target='_blank'
        className='text-xs lg:text-sm text-blue-600 font-medium font-inter w-full text-ellipsis overflow-hidden text-nowrap inline-block'
      >
        {value || '-'}
      </a>
    )}

    {!isLink && (
      <>
        {renderDate && default_dateformat ? (
          <p className='text-xs lg:text-sm text-black/65 font-inter font-medium w-full text-ellipsis overflow-hidden text-nowrap'>
            {value
              ? formateDate(value as string, default_dateformat, false)
              : '-'}
          </p>
        ) : (
          <p className='text-xs lg:text-sm text-black/65 font-medium font-inter w-full text-ellipsis overflow-hidden text-nowrap'>
            {value || '-'}
          </p>
        )}
      </>
    )}
  </div>
);
