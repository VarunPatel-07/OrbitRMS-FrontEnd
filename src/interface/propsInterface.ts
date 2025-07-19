import React, { SetStateAction } from 'react';
import { Editor } from '@tiptap/react';

import { countryObject } from '../Helper/countryDataHelper';
import { SelectedFileArrayObjInterface } from './interface';
import { GlobalContextStore } from './UserProfileInterface';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BreadcrumbsProps {
  label: string;
  name: string;
  link: string;
  target?: string;
  customIcon?: React.ReactNode;
}

export interface InputProps {
  name: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'url' | 'checkbox'; // More specific input types
  value?: string;
  setValue?: (value: string) => void; // Function that updates the value
  placeHolder?: string; // Optional placeholder
  className?: string;
  placeholderColor?: string;
  viewPasswordBtn?: boolean;
  showError?: boolean;
  errorMessage?: string;
  labelFieldName?: string;
  isRequiredField?: boolean;
  setUrlErrorType?: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  countryDropDownPosition?: 'top' | 'bottom';
  dropDownSelectedValue?: string | number;
  setDropDownSelectedValue?: React.Dispatch<SetStateAction<string | number>>;
  disabled?: boolean;
  countryDropDownMaxHeight?: number;
  countryOptionsData?: Array<countryObject>;
}

export interface DragDropUploaderProps {
  name: string;
  type: 'file' | 'image';
  RequiredFileTypeArray: Array<string>;
  showDropFileScreenInFullScreen: boolean;
  cropShape: 'round' | 'rect';
  maxCropHeight: number;
  maxCropWidth: number;
  setImageUrl: (url: string) => void;
}

export interface MultipleImageUploaderPropsInterface {
  name: string;
  type: 'file' | 'image';
  RequiredFileTypeArray: Array<string>;
  showDropFileScreenInFullScreen: boolean;
  cropShape: 'round' | 'rect';
  maxCropHeight: number;
  maxCropWidth: number;
  isImageCropperActive?: boolean;
  setIsImageCropperActive?: React.Dispatch<SetStateAction<boolean>>;
  handelUploadImage: (data: SelectedFileArrayObjInterface[]) => void;
  asPlusIcon?: boolean;
  disabled?: boolean;
  remainingImages?: number;
}

export interface commonDatePickerProps {
  selectedValue: Date | null;
  onChange: (date: Date | null) => void;
  labelFieldName?: string;
  isRequiredField?: boolean;
  name: string;
  className?: string;
  datePickerPosition?:
    | 'bottom'
    | 'bottom-end'
    | 'bottom-start'
    | 'left'
    | 'left-end'
    | 'left-start'
    | 'right'
    | 'right-end'
    | 'right-start'
    | 'top'
    | 'top-end'
    | 'top-start';
  showError?: boolean;
  errorMessage?: string;
  year?: number;
  disabled?: boolean;
}

export interface TextAreaProps {
  name: string;
  className?: string;
  cols?: number;
  rows?: number;
  value?: string;
  setValue?: React.Dispatch<SetStateAction<string>>;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  labelFieldName?: string;
  isRequiredField?: boolean;
  showError?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

export interface RichTextEditorApiCallIngReturnInterface {
  id: string;
  label: string;
  employeeCode: string;
  success: boolean;
  message: string;
}
export interface RichTextEditorApiResponseInterface {
  account_status: boolean;
  employee_code: string;
  first_name: string;
  full_name: string;
  id: string;
  last_name: string;
  middle_name: string;
  organization_id: string;
}
export interface RichTextEditorInterface {
  name: string;
  className?: string;
  cols?: number;
  rows?: number;
  value?: string;
  setValue?: React.Dispatch<SetStateAction<string>>;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  labelFieldName?: string;
  isRequiredField?: boolean;
  showError?: boolean;
  errorMessage?: string;
  handelApiCallingFunction: (
    query: string
  ) => Promise<RichTextEditorApiCallIngReturnInterface[]>;
  GlobalStateProvider: GlobalContextStore;
  handelOnUpdateFunction: (data: string) => void;
  onEditorReady?: (editor: Editor) => void;
  feedContent: string;
}

export interface SearchDropProps {
  name?: string;
  className?: string;
  labelFieldName?: string;
  isRequiredField?: boolean;
  selectedValue?: string;
  setSelectedValue?: React.Dispatch<SetStateAction<string>>;
  onSelectValBtn?: (data: string | object) => void;
  placeHolderName?: string;
  options: Array<string | object>;
  searchKey: string;
  position: 'bottom' | 'top';
  emptyDataMessage: string;
  loading?: boolean;
  showSearchBar?: boolean;
  showError?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

export interface Column {
  key: string;
  childKey?: string;
  title: string | React.ReactElement;
  isSortable: boolean;
  isSticky: boolean;
  canToggleVisibility: boolean;
  align?: 'left' | 'center' | 'right';
  filterable?: boolean;
  renderContent: (data: any, childKeyData?: any) => React.ReactElement;
  // onSortColumn: () => void;
}

export interface operatorObject {
  label: string;
  value: string;
  type: string;
}

export interface SearchBarFilterOptionsInterface {
  id: string;
  value: string;
  label: React.ReactElement;
  operator?: Array<operatorObject>;
  options?: Array<operatorObject>;
  optionType: 'text' | 'select' | 'multi-select' | 'date';
}

export interface ModalInfoType {
  success: boolean;
  protected: boolean;
  alertModalTitle: string;
  alertModelInfo: string;
  optionsButtonArray: Array<{
    buttonTitle: string;
    showButton: boolean;
    link?: string;
    classNames: string;
    icon?: React.ReactElement | null;
    onclickFunction?: () => void;
  }>;
}

// Define the props interface
export interface AlertModalProps {
  ModalInfo: ModalInfoType;
  showAlertModal: boolean;
  setShowAlertModal: React.Dispatch<SetStateAction<boolean>>;
}

export interface TableInfoHeaderInterfaceButtonArrayObject {
  buttonTitle: string;
  classNames: string;
  icon?: React.ReactElement | null;
  onclickFunction?: () => void;
}
export interface TableInfoHeaderInterface {
  moduleName: string;
  badgeValue: string;
  buttonsArray?: Array<TableInfoHeaderInterfaceButtonArrayObject>;
  renderDateSelector?: boolean;
  year?: number;
  handelYearButton?: (type: 'increment' | 'decrement') => void;
}

export interface ClonedRolePermissionInterface {
  clone_role_name: string;
  clone_role_id: string;
  config_module_id: string;
}
export interface AddRolesAndPermissionInterFace {
  role_name: string;
  description: string;
  status: boolean;
  clone_role_info: ClonedRolePermissionInterface;
}

export interface RolesPermissionInterface {
  config_module_id: string;
  created_at: string;
  updated_at: string;
  created_by: null;
  updated_by: null;
  description: string;
  id: string;
  role_name: string;
  source_type: string;
  status: boolean;
  employees: number;
}

export interface UrlEncodedFilterQueryInterface {
  field_name: string;
  operator: string;
  value: string;
}
export interface MetaDataInterface {
  total_data: number;
  total_pages: number;
  current_page: number;
  record_per_page: number;
}
