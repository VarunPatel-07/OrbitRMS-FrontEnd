import React, { SetStateAction } from 'react';

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
  type?: 'text' | 'password' | 'email' | 'number' | 'file' | 'url' | 'checkbox'; // More specific input types
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
  RequiredFileTypeArray?: Array<string>;
  setUrlErrorType?: (value: string) => void;
  showDropFileScreenInFullScreen?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  countryDropDownPosition?: 'top' | 'bottom';
  dropDownSelectedValue?: string | number;
  setDropDownSelectedValue?: React.Dispatch<SetStateAction<string | number>>;
  disabled?: boolean;
}

export interface TextAreaProps {
  name: string;
  className?: string;
}

export interface Column {
  key: string;
  title: string | React.ReactElement;
  isSortable: boolean;
  isSticky: boolean;
  canToggleVisibility: boolean;
  align?: 'left' | 'center' | 'right';
  filterable?: boolean;
  renderContent: (data: any) => React.ReactElement;
  // onSortColumn: () => void;
}

export interface operatorObject {
  label: string;
  value: string;
}

export interface clientInquiryFiltersInterFace {
  id: string;
  label: React.ReactElement;
  operator?: Array<operatorObject>;
  options?: Array<operatorObject>;
  type: string;
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
