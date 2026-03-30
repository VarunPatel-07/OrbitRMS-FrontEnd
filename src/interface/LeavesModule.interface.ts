import React, { SetStateAction } from 'react';

import { GlobalContextStore } from '@/interface/UserProfile.interface';

export interface ManageSelfLeaveModuleInterface {
  showAddLaveModal: boolean;
  setShowAddLeaveModal: React.Dispatch<SetStateAction<boolean>>;
}
export interface ManageTeamOrgLeaveModuleInterface {
  showAddLaveModal: boolean;
  setShowAddLeaveModal: React.Dispatch<SetStateAction<boolean>>;
  tab: 'organization' | 'team';
}

export interface LeaveBalanceCardLoaderInterface {
  totalNumberOfCards: number;
  className?: string;
  size?: 'sm' | 'xl';
}

export interface TeamLeaveSummaryCardInterface {
  renderDate: boolean;
  cardTitle: string;
  default_dateformat?: string;
  value?: string | number;
  onViewLeaveSummaryBtn?: () => void;
}

export interface TeamLeaveSummaryDataInterface {
  total_employees: number;
  employees_on_leave: number;
  planned_leaves: number;
  unplanned_leaves: number;
  pending_leaves: number;
  cancelled_leaves: number;
}

export interface LeavesReportingManager {
  id: string;
  middle_name: string;
  full_name: string;
  profile_picture_bg: string;
  first_name: string;
  last_name: string;
  profile_picture: string;
  employee_code: string;
}

export interface LeaveAppliedEmployeeInfo {
  id: string;
  middle_name: string;
  full_name: string;
  profile_picture_bg: string;
  first_name: string;
  last_name: string;
  profile_picture: string;
  employee_code: string;
}

export interface NotifyToUserDetailInterface {
  employee_code: string;
  first_name: string;
  full_name: string;
  id: string;
  last_name: string;
  middle_name: string;
}

export interface ManageAppliedSelfLeavesInterface {
  id: string;
  user_id: string;
  leave_type_id: string;

  leave_name: string;
  leave_code: string;
  description: string;

  start_date: string;
  end_date: string;
  start_half: 'first_half' | 'second_half';
  end_half: 'first_half' | 'second_half';

  total_days: number;

  status: 'pending' | 'approved' | 'rejected' | string;

  is_planned: boolean;
  notify_to_users: NotifyToUserDetailInterface[];
  documents: string;

  created_at: string;
  updated_at: string | null;

  created_by: string | null;
  updated_by: string | null;

  reporting_manager: LeavesReportingManager;
}

export interface ManageAppliedTeamLeavesInterface {
  id: string;
  user_id: string;
  leave_type_id: string;

  leave_name: string;
  leave_code: string;
  description: string;

  start_date: string;
  end_date: string;
  start_half: 'first_half' | 'second_half';
  end_half: 'first_half' | 'second_half';

  total_days: number;

  status: 'pending' | 'approved' | 'rejected' | string;

  is_planned: boolean;
  notify_to_users: NotifyToUserDetailInterface[];
  documents: string;

  created_at: string;
  updated_at: string | null;

  created_by: string | null;
  updated_by: string | null;

  reporting_manager: LeavesReportingManager;
  employee_info: LeaveAppliedEmployeeInfo;
}

export interface ViewLeaveDataModalInterface {
  leaveDetails:
    | ManageAppliedTeamLeavesInterface
    | ManageAppliedSelfLeavesInterface;
  defaultDateFormate: string;
  showModal: boolean;
  updateLeaveLoader?: 'pending' | 'approved' | 'rejected' | 'cancelled' | null;
  toggleViewLeaveDetails: () => void;
  updateTheLeaveRequest?: (
    leave_id: string,
    leave_status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  ) => void;
}

export interface LeaveUploadedDocumentObject {
  asset_id: string;
  public_id: string;
  file_name: string;
  file_type: string;
  folder: string;
  original_url: string;
  media_asset_url: string;
}

export interface TeamOrgLeaveModuleHeaderInterface {
  GlobalStateProvider: GlobalContextStore;
  data: TeamLeaveSummaryDataInterface;
}

export interface ManageSelfLeaveColumnsInterface {
  GlobalStateProvider: GlobalContextStore;
  toggleViewLeaveDetails: (data: ManageAppliedSelfLeavesInterface) => void;
}

export interface ManageTeamOrgLeaveColumnsInterface {
  GlobalStateProvider: GlobalContextStore;
  toggleViewLeaveDetails: (data: ManageAppliedTeamLeavesInterface) => void;
}

export interface LeaveEmployeeData {
  id: string;
  full_name: string;
  employee_code: string;
  reporting_to_id: string;
}
