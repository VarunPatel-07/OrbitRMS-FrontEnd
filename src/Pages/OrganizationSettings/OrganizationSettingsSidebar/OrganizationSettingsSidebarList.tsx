export interface OrganizationSettingsSidebarListInterface {
  id: 'general_info' | 'holiday';
  name: string;
  label: string;
  link: string;
  showToolTip: boolean;
  ToolTipValue: string;
}

export const OrganizationSettingsSidebarList = (
  organization: string
): OrganizationSettingsSidebarListInterface[] => [
  {
    id: 'general_info',
    name: 'General Info',
    label: 'api-manager-general-info-tooltip',
    link: `/${organization}/organization-settings/general-info`,
    showToolTip: false,
    ToolTipValue: 'General Info',
  },
  {
    id: 'holiday',
    name: 'Holiday',
    label: 'holiday-info-tooltip',
    link: `/${organization}/organization-settings/holiday`,
    showToolTip: false,
    ToolTipValue: 'Holiday',
  },
];
