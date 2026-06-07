import React, { SetStateAction } from 'react';

import { SelectedFileArrayObjInterface } from '@/interface/Global.interface';
import { OrganizationHolidays } from '@/interface/OrganizationSettings.interface';
import {
  GlobalContextStore,
  PermissionsModuleInterface,
} from '@/interface/UserProfile.interface';

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
export interface cloudSignDataInterface {
  time_stamp: number;
  signature: string;
  api_key: string;
  cloud_name: string;
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
  source_type: 'system' | 'announcement_team' | 'user';
  announcement_type:
    | 'general'
    | 'product_update'
    | 'birthday_wish'
    | 'work_anniversary_wish';
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
  comments: string[];
}

export interface OrganizationFeedPropsInterface {
  setShowAddEditPostModal: React.Dispatch<SetStateAction<boolean>>;
  feedPostData: FeedPostDataPropsInterface[];
  setFeedPostData: React.Dispatch<SetStateAction<FeedPostDataPropsInterface[]>>;
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
  stage: 'parsing' | 'uploading' | 'processing' | 'done';
  progress: number;
  uploadingPostFormData: AddEditPostFormdataInterface;
  permissionData: PermissionsModuleInterface;
}

export interface EmptyFeedAnimationPropsInterface {
  CTAButton?: React.ReactElement;
}

export interface LikesCommentsDataInterface {
  comment: string;
  department: string;
  designation: string;
  employee_code: string;
  first_name: string;
  full_name: string;
  id: string;
  last_name: string;
  middle_name: string;
  profile_picture: string;
  user_id: string;
  replies: LikesCommentsDataInterface[];
  metadata: {
    total_data: number;
    total_pages: number;
    current_page: number;
    record_per_page: number;
  };
}
export interface LikesCommentsModalInterface {
  type: 'comments' | 'likes';
  showModal: boolean;
  handelCancelButton: () => void;
  postId: string;
  setFeedPostData: React.Dispatch<SetStateAction<FeedPostDataPropsInterface[]>>;
  GlobalStateProvider: GlobalContextStore;
  feedPostData: FeedPostDataPropsInterface[];
}
