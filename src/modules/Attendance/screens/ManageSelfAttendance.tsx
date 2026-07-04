import { useContext, useEffect, useRef, useState } from 'react';

import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '@/contexts/globalState/GlobalStateContectApi';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '@/contexts/notification/NotificationContextApi';
import {
  AttendanceSessionInterface,
  AttendanceStateInterface,
} from '@/interface/Attendance.inteeface';
import { OrgLocationConfigCoordinates } from '@/interface/OrganizationSettings.interface';
import AttendanceHeader from '@/modules/Attendance/AttendanceHeader';

import { useDebounce } from '@/hooks/useDebounce';

import Button from '@/components/common/Button';
import ConfirmModal from '@/components/modals/ConfirmModal';
import {
  endpointObject,
  multipleFetchApi,
  multiplePostApi,
} from '@/utils/api/multipleAPI';
import { GetEndpointBasedType } from '@/utils/helpers/commonHelpers';

import AttendanceSessionRow from '../AttendanceSessionCard';

function ManageSelfAttendance() {
  const useEffectRef = useRef(false);
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const [modelType, setModelType] = useState<
    'punchIn' | 'punchOut' | 'startBreak' | 'endBreak' | null
  >(null);
  const [attendanceState, setAttendanceState] =
    useState<AttendanceStateInterface>({
      isPunchedIn: false,
      isOnBreak: false,
      punchInTime: '',
      totalBreakHours: 0,
      punchOutTime: '',
    });
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isPunchInOutBreakLoading, setIsPunchInOutBreakLoading] =
    useState<boolean>(false);
  const [attendanceData, setAttendanceData] = useState<
    AttendanceSessionInterface[]
  >([]);

  const handelPunchInOutBreaksWithDebounce = useDebounce(
    async (
      type: 'punchIn' | 'punchOut' | 'startBreak' | 'endBreak',
      data: OrgLocationConfigCoordinates
    ) => {
      const endPointObj: endpointObject[] = [
        {
          endPoint: `attendance/${GetEndpointBasedType(type)?.url}`,
          protected: true,
          data: { location_coordinates: data, is_work_from_home: false },
        },
      ];

      const response = await multiplePostApi(endPointObj);
      const res = response[0];
      setIsPunchInOutBreakLoading(false);
      handelNotification(res, 'top-right');
      if (res?.success) {
        setShowConfirmModal(false);
        fetchStatusWithDebounce();
        fetchMonthlyAttendanceWithDebounce();
      }
    },
    100
  );

  const fetchStatusWithDebounce = useDebounce(async () => {
    const endPointObj: endpointObject[] = [
      {
        endPoint: `attendance/session/attendance-status`,
        protected: true,
      },
    ];

    const response = await multipleFetchApi(endPointObj);
    const res = response[0];
    if (res?.success) {
      if (res?.data?.current_session) {
        setAttendanceState({
          isPunchedIn: res?.data?.current_session?.is_punched_in,
          isOnBreak: res?.data?.current_session?.is_on_break,
          punchInTime: res?.data?.current_session?.punch_in_time,
          totalBreakHours: res?.data?.current_session?.total_break_hours,
        });
      }
      if (res?.data?.last_session) {
        setAttendanceState({
          isPunchedIn: false,
          isOnBreak: false,
          punchInTime: res?.data?.last_session?.punch_in_time,
          totalBreakHours: res?.data?.last_session?.total_break_hours,
          punchOutTime: res?.data?.last_session?.punch_out_time,
        });
      }
    }
  }, 100);

  const fetchMonthlyAttendanceWithDebounce = useDebounce(async () => {
    const endPointObj: endpointObject[] = [
      {
        endPoint: `attendance/session/punch-in-out/fetch`,
        protected: true,
      },
    ];

    const response = await multipleFetchApi(endPointObj);
    const res = response[0];
    if (res?.success) {
      setAttendanceData(res?.data || []);
    } else {
      handelNotification(res, 'top-right');
    }
  }, 100);

  const confirmPunchInOutBreaks = (
    type: 'punchIn' | 'punchOut' | 'startBreak' | 'endBreak'
  ) => {
    setIsPunchInOutBreakLoading(true);
    navigator.geolocation.getCurrentPosition(
      (data) => {
        handelPunchInOutBreaksWithDebounce(type, {
          accuracy: data?.coords?.accuracy,
          latitude: data?.coords?.latitude,
          longitude: data?.coords?.longitude,
        });
      },
      () => {
        setIsPunchInOutBreakLoading(false);
        handelNotification(
          {
            success: false,
            message:
              'Unable to fetch location. Please allow location access and try again.',
          },
          'center'
        );
      }
    );
  };

  const handlePunchIn = (
    type: 'punchIn' | 'punchOut' | 'startBreak' | 'endBreak'
  ) => {
    setModelType(type);
    setShowConfirmModal(true);
  };

  const handelOnClose = () => {
    setShowConfirmModal(false);
    setModelType(null);
  };
  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    fetchStatusWithDebounce();
    fetchMonthlyAttendanceWithDebounce();
  }, []);
  return (
    <>
      <div className='w-full h-full flex flex-col items-start justify-start'>
        <div className='w-full px-3 pb-4'>
          <AttendanceHeader
            handlePunchIn={handlePunchIn}
            attendanceState={attendanceState}
          />
        </div>
        <div className='w-full flex items-center justify-between px-4 py-2 bg-gray-100'>
          <Button
            type='button'
            className='w-9 h-9 flex items-center justify-center border border-black/20 rounded-lg'
          >
            <RiArrowLeftSLine className='text-slate-900 text-2xl' />
          </Button>
          <div className='border border-black/20 px-5 py-2 rounded-md flex items-center justify-center bg-white'>
            <span className='text-black font-semibold text-sm inline-block'>
              April
            </span>
          </div>

          <Button
            type='button'
            className='w-9 h-9 flex items-center justify-center border border-black/20 rounded-lg'
          >
            <RiArrowRightSLine className='text-slate-900 text-2xl' />
          </Button>
        </div>
        <div className='w-full h-full max-h-[calc(100vh-400px)] overflow-auto flex flex-col gap-3 pt-4 pb-3 px-3'>
          {attendanceData?.map((session) => (
            <AttendanceSessionRow
              key={session.id}
              session={session}
              defaultDateFormate={
                GlobalStateProvider?.organization?.organization_settings
                  ?.default_dateformat
              }
            />
          ))}
        </div>
      </div>

      {modelType && (
        <ConfirmModal
          showConfirmModal={showConfirmModal}
          handelOnClose={handelOnClose}
          loading={isPunchInOutBreakLoading}
          handelConfirm={confirmPunchInOutBreaks}
          modalType={modelType}
          title={`Are you sure you want to ${GetEndpointBasedType(modelType)?.label}?`}
          description='Please confirm your action.'
          secondaryButtonTitle={`Confirm ${GetEndpointBasedType(modelType)?.label}`}
        />
      )}
    </>
  );
}

export default ManageSelfAttendance;
