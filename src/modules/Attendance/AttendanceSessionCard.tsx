import { useState } from 'react';

import { IoEye } from 'react-icons/io5';
import { Tooltip } from 'react-tooltip';

import { AttendanceSessionInterface } from '@/interface/Attendance.inteeface';

import Button from '@/components/common/Button';
import ShowAttendanceSessionModal from '@/components/modals/ShowAttendanceSessionModal';
import {
  calculateEffectiveBreakHours,
  calculateEffectiveGrossHors,
  formatDurationString,
  formateDate,
  formatHoursToHM,
  renderFormateTime,
} from '@/utils/helpers/commonHelpers';

function AttendanceSessionRow({
  session,
  defaultDateFormate,
}: {
  session: AttendanceSessionInterface;
  defaultDateFormate: string;
}) {
  const [selectedSession, setSelectedSession] =
    useState<AttendanceSessionInterface | null>(null);

  const handelOnClose = () => {
    setSelectedSession(null);
  };

  return (
    <>
      <div className='w-full min-h-[70px] flex items-center gap-0 rounded-xl border border-gray-200 bg-gray-100/30 hover:bg-gray-200/40 transition-colors overflow-hidden shadow-sm'>
        {/* Date column */}
        <div className='flex flex-col justify-center px-5 py-4 min-w-[140px] border-r border-gray-300/50'>
          <span className='text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-0.5'>
            Date
          </span>
          <span className='text-sm font-semibold text-gray-800'>
            {formateDate(session?.created_at, defaultDateFormate, false)}
          </span>
        </div>

        {/* Timeline column */}
        <div className='flex-1 flex items-center gap-3 px-5 py-4'>
          {/* Punch in */}
          <div className='flex flex-col items-start'>
            <span className='text-[10px] uppercase tracking-wider text-gray-400 mb-0.5'>
              In
            </span>
            <span className='text-sm font-semibold text-gray-800'>
              {renderFormateTime(session.punch_in_time)}
            </span>
          </div>

          {/* Timeline bar */}
          <div className='flex-1 flex items-center justify-center gap-1.5'>
            <div className='w-2 h-2 rounded-full bg-green-400' />
            <div className='w-[85%] h-1.5 rounded-full bg-gray-300/80 overflow-hidden flex'></div>

            <div
              className={`w-2 h-2 rounded-full ${
                session.punch_out_time
                  ? 'bg-gray-400'
                  : 'bg-amber-400 animate-pulse'
              }`}
            />
          </div>

          {/* Punch out */}
          <div className='flex flex-col items-end'>
            <span className='text-[10px] uppercase tracking-wider text-gray-400 mb-0.5'>
              Out
            </span>
            <span
              className={`text-sm font-semibold ${session.punch_out_time ? 'text-gray-800' : 'text-amber-500'}`}
            >
              {session.punch_out_time
                ? renderFormateTime(session.punch_out_time)
                : 'ongoing'}
            </span>
          </div>
        </div>

        {/* Duration badge */}
        <div className='flex flex-col items-center justify-center px-5 py-4 border-l border-gray-300/50 min-w-[90px]'>
          <span className='text-[10px] uppercase tracking-wider text-blue-600 font-medium mb-0.5'>
            Gross Hours
          </span>
          <span className='text-sm font-semibold text-gray-700'>
            {session?.status !== 'completed'
              ? calculateEffectiveGrossHors({
                  punchInTime: session?.punch_in_time,
                })
              : formatDurationString(session.total_gross_minutes)}
          </span>
        </div>
        <div className='flex flex-col items-center justify-center px-5 py-4 border-l border-gray-300/50 min-w-[90px]'>
          <span className='text-[10px] uppercase tracking-wider text-yellow-600 font-medium mb-0.5'>
            Break time
          </span>
          <span className='text-sm font-semibold text-gray-700'>
            {session?.status !== 'completed'
              ? formatHoursToHM(calculateEffectiveBreakHours(session.breaks))
              : formatDurationString(session.total_break_minutes)}
          </span>
        </div>
        <div className='flex flex-col items-center justify-center px-5 py-4 border-l border-gray-300/50 min-w-[90px]'>
          <span className='text-[10px] uppercase tracking-wider text-green-600 font-medium mb-0.5'>
            Effective Hours
          </span>
          <span className='text-sm font-semibold text-gray-700'>
            {session?.status !== 'completed'
              ? calculateEffectiveGrossHors({
                  punchInTime: session?.punch_in_time,
                  breakHours: calculateEffectiveBreakHours(session.breaks),
                })
              : formatDurationString(session.total_effective_minutes)}
          </span>
        </div>

        {/* Action */}
        <div className='border-l border-gray-300/50 px-4 flex items-center justify-center self-stretch'>
          <Button
            type='button'
            className='text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            data-tooltip-id='view_leave_button'
            data-tooltip-content='View Details Summary'
            onClick={() => setSelectedSession(session)}
          >
            <IoEye className='text-[18px]' />
          </Button>
          <Tooltip
            id='view_leave_button'
            opacity={'100'}
            className='z-[15] !bg-gray-900 !text-white text-xs !px-3 !py-1.5 !rounded-lg'
            place='left'
          />
        </div>
      </div>

      <ShowAttendanceSessionModal
        session={selectedSession}
        handleCancel={handelOnClose}
      />
    </>
  );
}

export default AttendanceSessionRow;
