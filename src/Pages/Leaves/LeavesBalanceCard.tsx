import { BsInfoCircleFill } from 'react-icons/bs';
import { IoEye } from 'react-icons/io5';
import { Tooltip } from 'react-tooltip';

import Button from '../../common/Button';
import { formateDate } from '../../Helper/HelperFunctions';
import { TeamLeaveSummaryCardInterface } from '../../interface/LeavesModule';
import { LeaveBalanceCardProps } from '../../interface/OrganizationSettings';

export const LeaveBalanceCard = ({ leaveData }: LeaveBalanceCardProps) => {
  const {
    available_leaves,
    leave_name,
    leave_code,
    description,
    max_number_of_leave,
    is_paid,
  } = leaveData;

  return (
    <div className='min-w-[300px] w-full max-w-[300px] bg-white rounded-lg overflow-hidden border border-gray-200'>
      <div className='bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-3'>
        <div className='flex items-center justify-between'>
          <div className='w-full'>
            <h3
              className='text-black text-xs font-semibold max-w-[85%] text-ellipsis overflow-hidden text-nowrap'
              title={leave_name + ' ' + '(' + leave_code + ')'}
            >
              {leave_name}
              <span className='text-black/70 text-[10px] font-medium pl-1'>
                ({leave_code})
              </span>
            </h3>
          </div>
          {description && (
            <div className='flex items-center gap-2'>
              <span
                className='cursor-pointer'
                data-tooltip-id='leave_balance_info_button'
                data-tooltip-content={description}
              >
                <BsInfoCircleFill className='w-5 h-5 text-black' />
              </span>
              <Tooltip
                id='leave_balance_info_button'
                opacity={'100'}
                className='z-[15] bg-black'
                place='top'
              />
            </div>
          )}
        </div>
      </div>

      <div className='px-6 py-[18px]'>
        <div className='flex items-end justify-between'>
          <div>
            <div className='flex items-baseline'>
              <span className='text-xl font-bold text-gray-800'>
                {available_leaves}
              </span>
              <span className='text-gray-500 text-sm ml-2'>
                / {max_number_of_leave}
              </span>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              is_paid
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {is_paid ? 'Paid' : 'Unpaid'}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TeamLeaveSummaryCard = ({
  cardTitle,
  value,
  default_dateformat,
  renderDate,
  onViewLeaveSummaryBtn,
}: TeamLeaveSummaryCardInterface) => {
  const currentDate = new Date().toDateString();
  return (
    <div className='min-w-fit w-full max-w-[300px] bg-white rounded-lg overflow-hidden border border-gray-200'>
      <div className='bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-3'>
        <div className='flex items-center justify-between'>
          <div className='w-full'>
            <h3
              className='text-black text-xs font-semibold max-w-[85%] text-ellipsis overflow-hidden text-nowrap'
              title={'Total On Leave'}
            >
              {cardTitle}
            </h3>
          </div>
        </div>
      </div>

      <div className='px-6 py-[18px] min-w-[240px]'>
        <div className='flex items-center justify-between w-fit'>
          {renderDate && default_dateformat ? (
            <span className='text-2xl font-bold text-gray-800 text-nowrap block'>
              {formateDate(currentDate, default_dateformat, false)}
            </span>
          ) : (
            <span className='text-xl font-bold text-gray-700'>{value}</span>
          )}

          {onViewLeaveSummaryBtn && (
            <>
              <Button
                type='button'
                className='text-gray-600 hover:bg-gray-100  p-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                data-tooltip-id='view_leave_button'
                data-tooltip-content='View Leave'
              >
                <IoEye className='text-[20px]' />
              </Button>
              <Tooltip
                id='view_leave_button'
                opacity={'100'}
                className='z-[15] !bg-gray-900 !text-white text-xs !px-3 !py-1.5 !rounded-lg'
                place='left'
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
