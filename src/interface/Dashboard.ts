import { SetStateAction } from 'react';

import { SelectedFileArrayObjInterface } from './interface';
import { OrganizationHolidays } from './OrganizationSettings';
import { GlobalContextStore } from './UserProfileInterface';

export interface DashboardPlaygroundPropsInterface {
  holidayData: OrganizationHolidays[];
  GlobalStateProvider: GlobalContextStore;
}
export interface HolidayedPropsInterFace {
  holidayData: OrganizationHolidays[];
  GlobalStateProvider: GlobalContextStore;
}

export interface AddEditPostFormdataInterface {
  images: SelectedFileArrayObjInterface[];
  description: string;
  isCommentDisabled: boolean;
  isLikeDisabled: boolean;
}

export interface FeedPostDataPropsInterface {
  created_at: string;
  description: string;
  id: string;
  images: string;
  isCommentDisabled: boolean;
  isLikeDisabled: boolean;
  organization_id: string;
  updated_at: null;
  user_id: string;
  source_type: 'default' | 'system' | 'ser_created';
  publisher: {
    department: string;
    designation: string;
    employee_code: string;
    first_name: string;
    full_name: string;
    id: string;
    last_name: string;
    middle_name: string;
    profile_picture: string;
  };
}

export interface OrganizationFeedPropsInterface {
  setShowAddEditPostModal: React.Dispatch<SetStateAction<boolean>>;
  feedPostData: FeedPostDataPropsInterface[];
  GlobalStateProvider: GlobalContextStore;
  loading: boolean;
}
