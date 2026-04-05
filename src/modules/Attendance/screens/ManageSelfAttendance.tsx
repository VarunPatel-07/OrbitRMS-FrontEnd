import { useContext, useEffect, useRef, useState } from 'react';

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

import ConfirmModal from '@/components/modals/ConfirmModal';
import {
  endpointObject,
  multipleFetchApi,
  multiplePostApi,
} from '@/utils/api/multipleAPI';

import AttendanceSessionRow from '../AttendanceSessionCard';

const getEndpointBasedType = (
  type: 'punchIn' | 'punchOut' | 'startBreak' | 'endBreak'
) => {
  switch (type) {
    case 'punchIn':
      return 'punch-in';
    case 'punchOut':
      return 'punch-out';
    case 'startBreak':
      return 'break/start-break';
    case 'endBreak':
      return 'break/end-break';
  }
};

function ManageSelfAttendance() {
  const useEffectRef = useRef(false);
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

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
          endPoint: `attendance/${getEndpointBasedType(type)}`,
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
        endPoint: `attendance/attendance-status`,
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
        endPoint: `attendance/punch-in-out/fetch`,
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
      <div>
        <AttendanceHeader
          handlePunchIn={handlePunchIn}
          attendanceState={attendanceState}
        />
        <div>
          {attendanceData?.map((session) => (
            <AttendanceSessionRow key={session.id} session={session} />
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
          title={`Are you sure you want to ${getEndpointBasedType(modelType)?.replace('-', ' ')}?`}
          description='Please confirm your action.'
          secondaryButtonTitle={`Confirm ${getEndpointBasedType(modelType)?.replace('-', ' ')}`}
        />
      )}
    </>
  );
}

export default ManageSelfAttendance;
