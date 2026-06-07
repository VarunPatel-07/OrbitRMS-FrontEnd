import { FaCoffee, FaRegClock } from 'react-icons/fa';
import { VscGraphLine } from 'react-icons/vsc';

import { AttendanceStateInterface } from '@/interface/Attendance.inteeface';

import Button from '@/components/common/Button';
import RenderCurrentTimeCard from '@/components/RenderCurrentTimeCard';
import {
  calculateEffectiveGrossHors,
  formatHoursToHM,
} from '@/utils/helpers/commonHelpers';

function AttendanceHeader({
  attendanceState,
  handlePunchIn,
}: {
  attendanceState: AttendanceStateInterface;
  handlePunchIn: (
    type: 'punchIn' | 'punchOut' | 'startBreak' | 'endBreak'
  ) => void;
}) {
  return (
    <div className='w-full flex items-stretch justify-start gap-3'>
      <div className='w-[40%]'>
        <div className='flex bg-gradient-to-r from-blue-500/5 to-blue-600/5 border border-gray-200 p-5 rounded-md items-end justify-between gap-3 h-full'>
          <div className='h-full'>
            <RenderCurrentTimeCard />
          </div>
          <div className='flex items-center justify-end gap-3'>
            {attendanceState?.isPunchedIn ? (
              <Button
                type='button'
                className='bg-rose-600 text-white px-4 py-2 text-sm rounded-md font-semibold'
                onClick={() => handlePunchIn('punchOut')}
              >
                Punch Out
              </Button>
            ) : (
              <Button
                type='button'
                className='bg-black text-white px-4 py-2 text-sm rounded-md font-semibold'
                onClick={() => handlePunchIn('punchIn')}
              >
                Punch In
              </Button>
            )}
            {attendanceState?.isPunchedIn && (
              <>
                {attendanceState?.isOnBreak ? (
                  <Button
                    type='button'
                    className='bg-black text-white px-4 py-2 text-sm rounded-md font-semibold'
                    onClick={() => handlePunchIn('endBreak')}
                  >
                    End Break
                  </Button>
                ) : (
                  <Button
                    type='button'
                    className='bg-green-600 text-white px-4 py-2 text-sm rounded-md font-semibold'
                    onClick={() => handlePunchIn('startBreak')}
                  >
                    Start Break
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className='w-[60%] flex items-stretch justify-end gap-3'>
        <div className='w-full h-full bg-gradient-to-r from-blue-500/5 to-blue-600/5 border border-gray-200 p-5 rounded-md flex flex-col items-start justify-between gap-3'>
          <div className='flex items-center justify-start gap-2'>
            <span className='w-6 h-6 bg-blue-50 border border-blue-200 rounded flex items-center justify-center text-blue-600'>
              <FaRegClock className='w-2.5 h-2.5 block' />
            </span>
            <span className='text-black font-normal text-sm'>Gross Hours</span>
          </div>

          <span className='text-black font-bold text-xl'>
            {calculateEffectiveGrossHors({
              punchInTime: attendanceState?.punchInTime,
              punchOutTime: attendanceState?.punchOutTime,
            })}
          </span>
        </div>
        <div className='w-full h-full bg-gradient-to-r from-blue-500/5 to-blue-600/5 border border-gray-200 p-5 rounded-md flex flex-col items-start justify-between gap-3'>
          <div className='flex items-center justify-start gap-2'>
            <span className='w-6 h-6 bg-yellow-50 border border-yellow-200 rounded flex items-center justify-center text-yellow-600'>
              <FaCoffee className='w-2.5 h-2.5 block' />
            </span>
            <span className='text-black font-normal text-sm'>Break time</span>
          </div>

          <span className='text-black font-bold text-xl'>
            {formatHoursToHM(attendanceState?.totalBreakHours)}
          </span>
        </div>
        <div className='w-full h-full bg-gradient-to-r from-blue-500/5 to-blue-600/5 border border-gray-200 p-5 rounded-md flex flex-col items-start justify-between gap-3'>
          <div className='flex items-center justify-start gap-2'>
            <span className='w-6 h-6 bg-green-50 border border-green-200 rounded flex items-center justify-center text-green-600'>
              <VscGraphLine className='w-2.5 h-2.5 block' />
            </span>
            <span className='text-black font-normal text-sm'>
              Effective Hours
            </span>
          </div>

          <span className='text-black font-bold text-xl'>
            {calculateEffectiveGrossHors({
              punchInTime: attendanceState?.punchInTime,
              breakHours: attendanceState?.totalBreakHours,
              punchOutTime: attendanceState?.punchOutTime,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AttendanceHeader;
