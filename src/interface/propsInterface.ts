/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BreadcrumbsProps {
  label: string;
  name: string;
  link: string;
  target?: string;
  customIcon?: React.ReactNode;
}

export interface InputProps {
  Type?: "text" | "password" | "email" | "number" | "file" | "url"; // More specific input types
  value?: string;
  setValue?: (value: string) => void; // Function that updates the value
  placeHolder?: string; // Optional placeholder
  ClassName?: string;
  placeholderColor?: string;
  viewPasswordBtn?: boolean;
  showError?: boolean;
  errorMessage?: string;
  showLabelField?: boolean;
  labelFieldName?: string;
  isRequiredField?: boolean;
  RequiredFileTypeArray?: Array<string>;
  setUrlErrorType?: (value: string) => void;
  showDropFileScreenInFullScreen?: boolean;
}

export interface Column {
  key: string;
  title: string | React.ReactElement;
  isSortable: boolean;
  isSticky: boolean;
  canToggleVisibility: boolean;
  align?: "left" | "center" | "right";
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
