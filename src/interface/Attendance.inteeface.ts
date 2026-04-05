export interface AttendanceStateInterface {
  isPunchedIn: boolean;
  isOnBreak: boolean;
  punchInTime: string;
  totalBreakHours: number;
  punchOutTime?: string;
}

export interface AttendanceBreaksInterface {
  id: string;
  session_id: string;
  break_start_time: string;
  break_end_time: string;
  break_duration: number;
  is_mislinious: boolean;

  // stored as stringified JSON in your DB
  punch_in_coordinates: string;
  punch_out_coordinates: string;

  status: 'completed' | 'active';
}

export interface AttendanceSessionInterface {
  id: string;
  user_id: string;

  punch_in_time: string;
  punch_out_time: string | null;

  punch_in_coordinates: string;
  punch_out_coordinates: string;

  is_mislinious: boolean;
  is_work_from_home: boolean;

  status: 'completed' | 'active';

  gross_hours: number;
  total_break_hours: number;
  total_working_hours: number;

  created_at: string;
  updated_at: string;

  breaks: AttendanceBreaksInterface[];
}
