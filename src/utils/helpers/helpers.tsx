import React, { ReactElement } from 'react';

import { Navigate } from 'react-router-dom';

import { EmployeeStatusInterface } from '@/interface/EmployeeModule.interface';
import { HalfToggleProps, InfoFieldProps } from '@/interface/Global.interface';

import Button from '@/components/common/Button';
import {
  ORG_EMPLOYEE_STATUS_ARRAY,
  SocialMediaPostStatusArray,
} from '@/utils/constants/global.constants';
import {
  classNames,
  formateDate,
  getDataFromSecureCookie,
} from '@/utils/helpers/commonHelpers';

const AccountStatusColor: Record<string, string> = {
  Intern: 'bg-yellow-500',
  Trainee: 'bg-fuchsia-600',
  Probation: ' bg-indigo-600',
  Confirmed: 'bg-green-500',
};

const PostStatusColor: Record<string, string> = {
  queued: 'bg-yellow-500',
  scheduled: 'bg-fuchsia-600',
  cancelled: ' bg-gray-600',
  posted: 'bg-green-500',
};
const PostStatusParentColor: Record<string, string> = {
  queued: 'bg-yellow-50 border border-yellow-600 text-yellow-600',
  scheduled: 'bg-fuchsia-50 border border-fuchsia-600 text-fuchsia-600 ',
  cancelled: ' bg-gray-50 border border-gray-600 text-gray-600',
  posted: 'bg-green-50 border border-green-600 text-green-600',
};

export const BeautifulAccountStatusRenderer = (
  status: EmployeeStatusInterface
): React.ReactNode => {
  if (ORG_EMPLOYEE_STATUS_ARRAY.includes(status)) {
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

export const BeautifulSocialMediaPostStatusRenderer = (
  status: 'queued' | 'scheduled' | 'posted' | 'cancelled'
): React.ReactNode => {
  if (SocialMediaPostStatusArray.includes(status)) {
    return (
      <span
        className={`border border-black/15 rounded-lg px-2.5 py-1 flex items-center justify-between gap-2 w-fit ${PostStatusParentColor[status]}`}
      >
        <span
          className={`w-2 h-2 inline-block rounded-full ${PostStatusColor[status]}`}
        ></span>
        <span className='text-sm font-inter font-medium capitalize'>
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

const sanitizeInput = (value: string) => {
  return value
    ?.toLowerCase()
    ?.trim()
    ?.replace(/[^a-z0-9\s]/g, '')
    ?.replace(/\s+/g, '.');
};

export const ConstructValidEmail = (
  firstName: string,
  middleName: string,
  lastName: string,
  emailSlug: string
) => {
  const sanitizeFirstName = sanitizeInput(firstName);
  const sanitizeMiddleName = sanitizeInput(middleName);
  const sanitizeLastName = sanitizeInput(lastName);

  const emailPrefix =
    sanitizeMiddleName && sanitizeMiddleName !== ''
      ? `${sanitizeFirstName}.${sanitizeMiddleName}.${sanitizeLastName}`
      : `${sanitizeFirstName}.${sanitizeLastName}`;

  const validateEmailPrefix = emailPrefix
    ?.replace(/\.{2,}/g, '.')
    ?.replace(/^\.+|\.+$/g, '');

  return validateEmailPrefix + '@' + emailSlug;
};

export const HandelPathFunction = () => {
  const _data = getDataFromSecureCookie('organization-info');
  const _isAuthenticated = getDataFromSecureCookie('authenticationToken');

  const data = typeof _data === 'string' ? JSON.parse(_data) : _data;

  if (data && _isAuthenticated) {
    return <Navigate to={`/${data?.portal_slug}/dashboard`} replace />;
  } else {
    return <Navigate to={`/auth/sign-in`} replace />;
  }
};

export const FormateLeaveHalf = (half: 'first_half' | 'second_half') => {
  if (!half) return '—';
  return half === 'first_half' ? 'First Half' : 'Second Half';
};

export const LeaveInfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className='flex items-start justify-between py-2.5 border-b border-gray-100 last:border-0'>
      <span className='text-xs font-medium text-gray-400 uppercase tracking-wide w-32 flex-shrink-0 pt-0.5'>
        {label}
      </span>
      <span className='text-sm text-gray-800 text-right font-medium'>
        {value ?? '—'}
      </span>
    </div>
  );
};

export const LeaveSectionTitle = ({
  children,
}: {
  children: ReactElement | string;
}) => {
  return (
    <div className='flex items-center gap-2 mb-3 mt-5'>
      <span className='text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap'>
        {children}
      </span>
      <div className='flex-1 h-px bg-gray-100' />
    </div>
  );
};

export const LeavesHalfToggleButton = ({
  value,
  name,
  onSelect,
  disabled,
}: HalfToggleProps) => {
  return (
    <div
      className='flex items-stretch rounded-xl overflow-hidden border border-black/45 bg-white'
      style={{ minWidth: 200 }}
    >
      {(['first_half', 'second_half'] as const).map((half, i) => {
        const active = value === half;
        const label = half === 'first_half' ? 'First Half' : 'Second Half';
        return (
          <Button
            key={half}
            type='button'
            onClick={() => onSelect(name, half)}
            disabled={disabled}
            className={classNames(
              'flex-1 text-xs font-semibold px-3 py-2 transition-all duration-150 focus:outline-none',
              {
                'text-white': active,
                'text-gray-500 hover:text-gray-700 hover:bg-gray-50': !active,
                'border-r border-gray-200': i === 0,
              }
            )}
            style={active ? { background: 'var(--them-green-color)' } : {}}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
};

export const IsStringArrayString = (string: string): boolean => {
  try {
    const parsed = JSON?.parse(string);

    if (
      Array.isArray(parsed) &&
      parsed.every((item) => typeof item === 'string')
    ) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};
