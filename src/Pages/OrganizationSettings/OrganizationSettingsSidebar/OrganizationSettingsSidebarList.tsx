export interface OrganizationSettingsSidebarListInterface {
  id: 'general_info' | 'holiday' | 'leaves_manager';
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
  {
    id: 'holiday',
    name: 'Leaves Manager',
    label: 'leaves-manager-tooltip',
    link: `/${organization}/organization-settings/leaves-manager`,
    showToolTip: false,
    ToolTipValue: 'Holiday',
  },
];
