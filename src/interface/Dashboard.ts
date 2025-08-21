import React, { SetStateAction } from 'react';

import { SelectedFileArrayObjInterface } from './interface';
import { OrganizationHolidays } from './OrganizationSettings';
import { GlobalContextStore } from './UserProfileInterface';

export interface DashboardPlaygroundPropsInterface {
  holidayData: OrganizationHolidays[];
  GlobalStateProvider: GlobalContextStore;
  isLoadingHoliday: boolean;
}
export interface HolidayedPropsInterFace {
  holidayData: OrganizationHolidays[];
  GlobalStateProvider: GlobalContextStore;
}

export interface OrganizationPostLikesInterface {
  full_name: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  profile_picture: string;
  department: string;
  designation: string;
  employee_code: string;
  id: string;
}

export interface AddEditPostFormdataInterface {
  new_images: SelectedFileArrayObjInterface[];
  description: string;
  isCommentDisabled: boolean;
  isLikeDisabled: boolean;
  existing_images: string[];
  likes: string[];
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
  likes: string[];
  comments: {
    comment: string;
    id: string;
    is_replay: boolean;
    organization_update_id: string;
    user_id: string;
  }[];
}

export interface OrganizationFeedPropsInterface {
  setShowAddEditPostModal: React.Dispatch<SetStateAction<boolean>>;
  feedPostData: FeedPostDataPropsInterface[];
  likedPosts: string[];
  GlobalStateProvider: GlobalContextStore;
  loading: boolean;
  editPostHandler: (feedData: FeedPostDataPropsInterface) => void;
  handelClickOnDeleteButton: (id: string) => void;
  handelClickOnLikeToggle: (post_id: string) => void;
  submitCommentOnClick: (
    post_id: string,
    data: string,
    callback: () => void
  ) => void;
}

export interface EmptyFeedAnimationPropsInterface {
  CTAButton?: React.ReactElement;
}
