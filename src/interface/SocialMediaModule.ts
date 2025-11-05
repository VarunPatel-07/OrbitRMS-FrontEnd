import React, { SetStateAction } from 'react';

import { SelectedFileArrayObjInterface } from './interface';
import {
  GlobalContextStore,
  PermissionsModuleInterface,
} from './UserProfileInterface';

export interface ConnectedSocialMediaAccountInterface {
  access_token: string;
  account_name: string;
  created_at: string;
  expires_at: Date | null;
  extra_data: {
    page_id: string;
    user_access_token: string;
  };
  id: string;
  is_active: boolean;
  organization_id: string;
  platform: 'facebook' | 'instagram';
  refresh_token: string | null;
}

export interface SocialMediaCardInterface {
  data: ConnectedSocialMediaAccountInterface;
  dropdownRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  setHandelClickOnDropDown: React.Dispatch<SetStateAction<string>>;
  handelClickOnDropDown: string;
}

export interface SocialMediaModuleModalInterface {
  showModal: boolean;
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
  GlobalStateProvider: GlobalContextStore;
  selectedAccountArr: string[];
}

export interface SocialMediaModuleModalArrayListInterface {
  name: string;
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter';
  onClickFunction: () => void;
}

export interface ConnectedPlatformsInterface {
  GlobalStateProvider: GlobalContextStore;
  loading: boolean;
  data: ConnectedSocialMediaAccountInterface[];
  dropdownRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
  showModal: boolean;
  handelClickOnDropDown: string;
  setHandelClickOnDropDown: React.Dispatch<SetStateAction<string>>;
}
export interface SocialMedialPostComponentInterface {
  setShowAddEditPostModal: React.Dispatch<SetStateAction<boolean>>;
  socialPostArray: SocialMediaPostDataInterface[];
  handelClickOnDeleteButton: (
    postId: string,
    selected_platforms: string
  ) => void;
  loading: boolean;
  permissionData: PermissionsModuleInterface;
}

export interface AddEditSocialMediaPostFormdataInterface {
  new_images: SelectedFileArrayObjInterface[];
  caption: string;
  existing_images: string[];
  platforms: string[];
  type: 'default' | 'scheduled';
  scheduled_on: Date | null;
}
export interface AddEditSocialMediaPostModalInterface {
  showModal: boolean;
  handelOnSubmit: () => void;
  formData: AddEditSocialMediaPostFormdataInterface;
  setFormData: React.Dispatch<
    SetStateAction<AddEditSocialMediaPostFormdataInterface>
  >;
  loading: boolean;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  handelCancelButton: () => void;
  selectedAccountArr: string[];
}

export interface SocialMediaPostDataInterface {
  caption: string;
  created_at: string;
  id: string;
  is_scheduled: boolean;
  media_urls: string;
  organization_id: string;
  post_publish_records: string;
  posted_at: string | null;
  scheduled_on: string | null;
  selected_platforms: string;
  status: 'queued' | 'scheduled' | 'posted' | 'cancelled';
  type: 'default' | 'scheduled';
  updated_at: string;
}

export interface SocialMediaPostCardInterface {
  data: SocialMediaPostDataInterface;
  permissionData: PermissionsModuleInterface;
  handelClickOnDeleteButton: (
    postId: string,
    selected_platforms: string
  ) => void;
}
