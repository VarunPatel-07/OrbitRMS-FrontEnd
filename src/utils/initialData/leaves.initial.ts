import {
  LeaveAppliedEmployeeInfo,
  LeavesReportingManager,
  ManageAppliedSelfLeavesInterface,
  ManageAppliedTeamLeavesInterface,
} from '@/interface/LeavesModule.interface';
import { LeaveBalanceInterface, LeavesTypesInterface } from '@/interface/OrganizationSettings.interface';

export const INITIAL_LEAVE_TYPE: LeavesTypesInterface = {
  id: '',
  leave_name: '',
  leave_code: '',
  is_paid: false,
  max_number_of_leave: 0,
  refill_quarterly: false,
  refill_from: 'January',
  description: '',
  gender: '',
  employee_status: '',
  marital_status: '',
  status: true,
  organization_id: '',
  created_at: '',
  created_by: null,
  source_type: '',
  updated_at: null,
  updated_by: null,
};

export const INITIAL_MANAGE_APPLIED_SELF_LEAVE: ManageAppliedSelfLeavesInterface =
  {
    id: '',
    user_id: '',
    leave_type_id: '',

    leave_name: '',
    leave_code: '',
    description: '',

    start_date: '',
    end_date: '',
    start_half: 'first_half',
    end_half: 'first_half',

    total_days: 0,

    status: 'pending',

    is_planned: false,
    notify_to_id: null,
    documents: '[]',

    created_at: '',
    updated_at: null,

    created_by: null,
    updated_by: null,

    reporting_manager: {} as LeavesReportingManager,
  };

export const INITIAL_MANAGE_APPLIED_TEAM_LEAVE: ManageAppliedTeamLeavesInterface =
  {
    id: '',
    user_id: '',
    leave_type_id: '',

    leave_name: '',
    leave_code: '',
    description: '',

    start_date: '',
    end_date: '',
    start_half: 'first_half',
    end_half: 'first_half',

    total_days: 0,

    status: 'pending',

    is_planned: false,
    notify_to_id: null,
    documents: '[]',

    created_at: '',
    updated_at: null,

    created_by: null,
    updated_by: null,

    reporting_manager: {} as LeavesReportingManager,
    employee_info: {} as LeaveAppliedEmployeeInfo,
  };
export const TEAM_SUMMARY_INITIAL_DATA = {
  total_employees: 0,
  employees_on_leave: 0,
  planned_leaves: 0,
  unplanned_leaves: 0,
  pending_leaves: 0,
  cancelled_leaves: 0,
};

export const INITIAL_LEAVE_BALANCE: LeaveBalanceInterface = {
  available_leaves: 0,
  description: '',
  employee_status: '',
  gender: '',
  id: '',
  is_paid: true,
  leave_code: '',
  leave_name: '',
  leave_type_id: '',
  marital_status: '',
  max_number_of_leave: 0,
  organization_id: '',
  status: false,
  user_id: '',
};
