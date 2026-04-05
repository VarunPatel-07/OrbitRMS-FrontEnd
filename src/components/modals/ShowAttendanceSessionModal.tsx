import { AttendanceBreaksInterface } from '@/interface/Attendance.inteeface';
import { ShowAttendanceSessionModalInterface } from '@/interface/ComponentProps.interface';

import {
  calculateEffectiveGrossHors,
  formatDurationString,
  formatHoursToHM,
  ParseIsoDateToLocalDate,
  renderFormateTime,
} from '@/utils/helpers/commonHelpers';

import DialogModalContainer from '../common/DialogModalContainer';

function ShowAttendanceSessionModal({
  session,
  handleCancel,
}: ShowAttendanceSessionModalInterface) {
  const calculateEffectiveBreakHours = (
    breaks: AttendanceBreaksInterface[]
  ): number => {
    if (!breaks || breaks.length === 0) return 0;
    let totalMinutes = 0;

    for (const b of breaks) {
      if (b.break_end_time && b.break_duration) {
        // FIX: Ensure b.break_duration is in the correct unit.
        // If your DB saves seconds, divide by 60 here.
        totalMinutes += b.break_duration;
      } else if (b.break_start_time) {
        const start = ParseIsoDateToLocalDate(b.break_start_time)?.getTime();
        if (!start) continue;
        const now = Date.now();
        const diffInMs = now - start;
        if (diffInMs > 0) {
          totalMinutes += diffInMs / 60000;
        }
      }
    }

    // Return hours because formatDurationString likely expects hours
    return Math.floor(totalMinutes) / 60;
  };

  if (session) {
    return (
      <DialogModalContainer
        show={!!session}
        onClose={handleCancel}
        className='bg-white w-full'
        maxWidth='512px'
        loading={false}
        modalTitle='Session details'
      >
        <div className='bg-white w-full max-w-lg rounded-t-xl border border-gray-100 max-h-[80vh] overflow-y-auto'>
          <div className='grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100'>
            {[
              {
                label: 'Gross',
                value:
                  session?.gross_hours === 0
                    ? calculateEffectiveGrossHors({
                        punchInTime: session?.punch_in_time,
                      })
                    : formatHoursToHM(session.gross_hours),
                cls: 'text-gray-800',
              },
              {
                label: 'Break',
                value: formatHoursToHM(
                  calculateEffectiveBreakHours(session.breaks)
                ),
                cls: 'text-red-500',
              },
              {
                label: 'Effective',
                value:
                  session?.total_working_hours === 0
                    ? calculateEffectiveGrossHors({
                        punchInTime: session?.punch_in_time,
                        breakHours: calculateEffectiveBreakHours(
                          session.breaks
                        ),
                      })
                    : formatHoursToHM(session.total_working_hours),
                cls: 'text-green-600',
              },
            ].map(({ label, value, cls }) => (
              <div key={label} className='px-5 py-3'>
                <p className='text-[11px] uppercase tracking-wide text-gray-400 mb-1'>
                  {label}
                </p>
                <p className={`text-lg font-medium ${cls}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Punch bar */}
          <div className='flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100'>
            <div className='flex items-center gap-2'>
              <span className='w-2 h-2 rounded-full bg-green-700' />
              <span className='text-xs text-gray-400'>In</span>
              <span className='text-sm font-medium text-black'>
                {renderFormateTime(session.punch_in_time)}
              </span>
            </div>
            <div className='flex-1 mx-3 h-px bg-gray-200' />
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium'>
                {session.punch_out_time
                  ? renderFormateTime(session.punch_out_time)
                  : '—'}
              </span>
              <span className='text-xs text-gray-400'>Out</span>
              <span className='w-2 h-2 rounded-full bg-red-400' />
            </div>
          </div>

          {/* Breaks */}
          <div className='px-5 pt-4 pb-6'>
            <p className='text-[11px] uppercase tracking-wide text-gray-400 mb-1'>
              Breaks · {session.breaks.length}
            </p>
            {session.breaks.length === 0 ? (
              <p className='text-sm text-gray-300 py-2'>No breaks recorded</p>
            ) : (
              session.breaks.map((b, i) => (
                <div
                  key={b.id}
                  className='flex items-center justify-between py-2.5 border-t border-gray-100'
                >
                  <div className='flex items-center gap-3'>
                    <span className='text-xs text-gray-400 w-5'>#{i + 1}</span>
                    <span className='text-sm text-gray-700'>
                      {renderFormateTime(b.break_start_time)} –{' '}
                      {b.break_end_time
                        ? renderFormateTime(b.break_end_time)
                        : 'ongoing'}
                    </span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span className='text-sm text-red-500'>
                      {b.break_duration === 0
                        ? calculateEffectiveGrossHors({
                            punchInTime: b.break_start_time,
                          })
                        : formatDurationString(b.break_duration)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogModalContainer>
    );
  }
}

export default ShowAttendanceSessionModal;
