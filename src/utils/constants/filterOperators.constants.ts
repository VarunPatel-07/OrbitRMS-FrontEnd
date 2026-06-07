import { FilterFieldsTypeEnums } from '@/utils/enums/enums';

export const Equals = {
  label: 'equals',
  value: 'Equals',
  type: FilterFieldsTypeEnums[1],
};

export const Is = {
  label: 'is',
  value: 'Is',
  type: FilterFieldsTypeEnums[1],
};
export const Between = {
  label: 'between',
  value: 'Between',
  type: FilterFieldsTypeEnums[1],
};
export const Contains = {
  label: 'contains',
  value: 'Contains',
  type: FilterFieldsTypeEnums[1],
};
export const StartsWith = {
  label: 'starts_with',
  value: 'Starts With',
  type: FilterFieldsTypeEnums[1],
};
export const EndsWith = {
  label: 'ends_with',
  value: 'Ends With',
  type: FilterFieldsTypeEnums[1],
};

export const OPTION_TYPE = {
  TEXT: 'TEXT',
  SELECT: 'SELECT',
  MULTI_SELECT: 'MULTI_SELECT',
  DATE: 'DATE',
} as const;
