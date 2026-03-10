import React, { HTMLAttributes, RefObject, SetStateAction } from 'react';

import { SelectedFileArrayObjInterface } from '@/interface/Global.interface';
import { GlobalContextStore } from '@/interface/UserProfile.interface';
import { Editor } from '@tiptap/react';

import { OPTION_TYPE } from '@/utils/constants/filterOperators.constants';
import { countryObject } from '@/utils/helpers/countryData';

import { AddEditPostFormdataInterface } from './Dashboard.interface';
import {
  AddEditLeavesTypesInterface,
  HolidayFormData,
} from './OrganizationSettings.interface';

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
  InfoIconContent?: string;
  InfoIconToolTipPlace?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end';
}

export interface ImageCommonComponent extends HTMLAttributes<HTMLImageElement> {
  src: string;
  loading?: 'eager' | 'lazy';
  height?: number;
  width?: number;
  className?: string;
  alt: string;
}

export interface DragDropUploaderProps {
  name: string;
  type: 'file' | 'image';
  RequiredFileTypeArray: Array<string>;
  showDropFileScreenInFullScreen: boolean;
  maxCropHeight: number;
  maxCropWidth: number;
  setImageUrl: (url: string) => void;
  disabled: boolean;
  enableCropping?: boolean;
  cropShape?: 'round' | 'rect';
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
  showError?: boolean;
  errorMessage?: string;
  maxSize?: number;
  enableCropping?: boolean;
}

export interface commonDatePickerProps {
  selectedValue: Date | null;
  startDate?: Date | null;
  endDate?: Date | null;
  onChange?: (date: Date | null) => void;
  onRangeSelect?: (
    dates: [Date | null, Date | null],
    _event?: React.MouseEvent | React.KeyboardEvent
  ) => void;
  maxDate?: Date;
  minDate?: Date;
  labelFieldName?: string;
  isRequiredField?: boolean;
  selectsRange?: boolean;
  name: string;
  className?: string;
  selectsStart?: boolean;
  selectsEnd?: boolean;
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
  handelApiCallingFunction?: (
    query: string
  ) => Promise<RichTextEditorApiCallIngReturnInterface[]>;
  GlobalStateProvider: GlobalContextStore;
  handelOnUpdateFunction: (data: string) => void;
  onEditorReady?: (editor: Editor) => void;
  feedContent: string;
  classNames?: string;
  height?: number;
  showMenuBar?: boolean;
  disabled?: boolean;
}

export interface SearchDropProps {
  name?: string;
  className?: string;
  labelFieldName?: string;
  isRequiredField?: boolean;
  selectedValue?: string;
  setSelectedValue?: React.Dispatch<SetStateAction<string>>;
  onSelectValBtn?: (data: string | object, index?: number) => void;
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

export interface MultiSelectSearchDropInterface {
  name?: string;
  className?: string;
  labelFieldName?: string;
  isRequiredField?: boolean;
  selectedValue?: string[];
  setSelectedValue?: React.Dispatch<SetStateAction<string>>;
  onSelectValBtn?: (data: string | object, index?: number) => void;
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
  optionType: keyof typeof OPTION_TYPE;
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
  loader?: boolean;
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
  loading?: boolean;
  renderElement?: React.ReactElement;
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

export interface ModuleValueInterface {
  label: string;
  value: string;
  type: string;
  customLayout?: React.ReactElement;
}

export interface FilterObjectInterface {
  id: string;
  moduleValue: ModuleValueInterface[];
  optionType?: keyof typeof OPTION_TYPE;
}

export interface handleMultiInputChangeInterface {
  filterObject: FilterObjectInterface[];
  selectedFilterObject: FilterObjectInterface[];
  inputFieldRef: RefObject<HTMLInputElement>;
  inputValue: string;
  setInputValue: React.Dispatch<SetStateAction<string>>;
  setShowFilterDropDownMenu: React.Dispatch<SetStateAction<boolean>>;
  optionType: 'TEXT' | 'SELECT' | 'MULTI_SELECT' | 'DATE' | undefined;
  searchInputValue: string;
  setSearchInputValue: React.Dispatch<SetStateAction<string>>;
}

export interface FiltersOptionsDropdownInterface {
  showCurrentOptionDropdown: boolean;
  filterColumnsArray: SearchBarFilterOptionsInterface[];
  currentFilterId: string;
  filterObject: FilterObjectInterface[];
  setShowCurrentOperatorDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCurrentOptionDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  updateFilterObject: (
    newItem: ModuleValueInterface,
    id: string,
    callback?: (updatedArray: FilterObjectInterface[]) => void
  ) => void;
  setFilterObject: React.Dispatch<
    React.SetStateAction<FilterObjectInterface[]>
  >;
  updateFinalFilterQuery: (newData: FilterObjectInterface[]) => void;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  showFilterDropDownMenu: boolean;
  searchInputValue: string;
  enterClickHandler: () => void;
}

export interface FilterInputMainFilterDropdownInterface {
  showFilterDropDownMenu: boolean;
  currentFilterId: string;
  filterColumnsArray: SearchBarFilterOptionsInterface[];
  selectedFilterObject: FilterObjectInterface[];
  setShowFilterDropDownMenu: React.Dispatch<SetStateAction<boolean>>;
  setCurrentFilterId: React.Dispatch<SetStateAction<string>>;
  setFilterObject: React.Dispatch<SetStateAction<FilterObjectInterface[]>>;
  setShowCurrentOperatorDropdown: React.Dispatch<SetStateAction<boolean>>;
}

export interface FiltersOperatorDropdownInterface {
  showCurrentOperatorDropdown: boolean;
  filterColumnsArray: SearchBarFilterOptionsInterface[];
  currentFilterId: string;
  updateFilterObject: (
    newItem: ModuleValueInterface,
    id: string,
    callback?: (updatedArray: FilterObjectInterface[]) => void
  ) => void;
  setShowCurrentOperatorDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCurrentOptionDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  handelInputFieldFocus: () => void;
  showFilterDropDownMenu: boolean;
}

export interface FilterInputDateSelectorInterface {
  showCurrentOptionDropdown: boolean;
  setShowCurrentOptionDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  currentFilterId: string;
  filterObject: FilterObjectInterface[];
  setFilterObject: React.Dispatch<
    React.SetStateAction<FilterObjectInterface[]>
  >;
  updateFilterObject: (
    newItem: ModuleValueInterface,
    id: string,
    callback?: (updatedArray: FilterObjectInterface[]) => void
  ) => void;
  updateFinalFilterQuery: (newData: FilterObjectInterface[]) => void;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

export interface ErrorDialogInterface {
  showErrorModal: boolean;
  setShowErrorModal?: React.Dispatch<SetStateAction<boolean>>;
  title?: string;
  message?: string;
  errorDetails?: React.ReactElement | string;
  minHeight?: number;
  onClose?: () => void;
}

export interface DeleteConfirmationDialogInterface {
  showDeleteModal: boolean;
  setShowDeleteModal: React.Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  handelDelete: () => void;
  name?: string;
  ExtraErrorMessage?: React.ReactElement;
  minHeight?: number;
}

export interface ClientInquirySidebarModelInterface {
  clientInquiryData: any;
  showClientInquiryDetail: boolean;
  setShowClientInquiryDetail: React.Dispatch<SetStateAction<boolean>>;
}

export interface ResetPasswordLinkModalInterface {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  handelSubmit: (mail: string, callBack: (success: boolean) => void) => void;
  companyEmail: string;
  personalEmail: string;
}

export interface AlertDialogInterface {
  showDeleteModal: boolean;
  setShowDeleteModal: React.Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  handelDelete: () => void;
  title?: string;
  ExtraErrorMessage?: React.ReactElement;
  minHeight?: number;
  description?: string;
  secondaryButtonTitle?: string;
}

export interface CommanAddModalPropsInterface {
  modalTitle: string;
  showColorPicker: boolean;
  showPreview: boolean;
  labelFieldName: string;
  loading: boolean;
  showModal: boolean;
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
  handelFormSubmitFunction: (value: string, bgColor?: string) => void;
  value: string;
  setValue: React.Dispatch<SetStateAction<string>>;
  modalType: 'add' | 'edit';
  color?: string;
  setColor?: React.Dispatch<SetStateAction<string>>;
  fieldType?: string;
  setFieldType?: React.Dispatch<SetStateAction<string>>;
  isRequiredField?: string;
  setIsRequiredField?: React.Dispatch<SetStateAction<string>>;
  dummyValue: string;
  dummyColor?: string;
  dummyFieldType?: string;
}

export interface AddEditPostModalInterface {
  showAddEditPostModal: boolean;

  GlobalStateProvider: GlobalContextStore;
  handelOnSubmit: () => void;
  onEditorReady?: (editor: Editor) => void;
  formData: AddEditPostFormdataInterface;
  dummyFormData: AddEditPostFormdataInterface;
  setFormData: React.Dispatch<SetStateAction<AddEditPostFormdataInterface>>;
  loading: boolean;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  handelCancelButton: () => void;
  handelApiCallingFunction: (
    query: string
  ) => Promise<RichTextEditorApiCallIngReturnInterface[]>;
}

export interface AddEditLeavesTypePropsInterface {
  showModal: boolean;
  loading: boolean;
  modalType: 'add' | 'edit';
  editLeaveData: AddEditLeavesTypesInterface | null;
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
  onSave: (data: AddEditLeavesTypesInterface, callback?: () => void) => void;
}

export interface AddEditHolidayDialogInterface {
  formData: HolidayFormData;
  dummyFormData: HolidayFormData;
  setFormData: React.Dispatch<React.SetStateAction<HolidayFormData>>;
  modalTitle: string;
  loading: boolean;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  handelFormSubmitFunction: (formData: HolidayFormData) => void;
  modalType: 'add' | 'edit';
  year: number;
}
