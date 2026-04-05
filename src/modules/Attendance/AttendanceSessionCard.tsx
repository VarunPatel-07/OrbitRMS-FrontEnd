import { useState } from 'react';

import { BiChevronRight } from 'react-icons/bi';

import { AttendanceSessionInterface } from '@/interface/Attendance.inteeface';

import ShowAttendanceSessionModal from '@/components/modals/ShowAttendanceSessionModal';
import {
  calculateEffectiveGrossHors,
  formatHoursToHM,
  renderFormateTime,
} from '@/utils/helpers/commonHelpers';

function AttendanceSessionRow({
  session,
}: {
  session: AttendanceSessionInterface;
}) {
  const [selectedSession, setSelectedSession] =
    useState<AttendanceSessionInterface | null>(null);

  const handelOnClose = () => {
    setSelectedSession(null);
  };
  return (
    <>
      <button
        onClick={() => {
          setSelectedSession(session);
        }}
        className='w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-colors text-left'
      >
        <span
          className={`w-2 h-2 rounded-full flex-shrink-0 ${session.status === 'active' ? 'bg-green-700' : 'bg-gray-400'}`}
        />
        <span className='text-sm font-medium text-gray-800 min-w-[60px]'>
          {renderFormateTime(session.punch_in_time)}
        </span>
        <div className='flex-1 h-px bg-gray-200' />
        <span className='text-xs text-gray-400'>
          {session.punch_out_time
            ? renderFormateTime(session.punch_out_time)
            : 'ongoing'}
        </span>
        <div className='w-px h-4 bg-gray-200' />
        <span className='text-sm font-medium text-gray-800 min-w-[52px] text-right'>
          {session?.gross_hours === 0
            ? calculateEffectiveGrossHors({
                punchInTime: session?.punch_in_time,
              })
            : formatHoursToHM(session.gross_hours)}
        </span>
        <span
          className={`text-[11px] px-2.5 py-0.5 rounded-full ${
            session.status === 'active'
              ? 'bg-green-50 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {session.status}
        </span>
        <BiChevronRight size={14} className='text-gray-300 flex-shrink-0' />
      </button>
      <ShowAttendanceSessionModal
        session={selectedSession}
        handleCancel={handelOnClose}
      />
    </>
  );
}

export default AttendanceSessionRow;
