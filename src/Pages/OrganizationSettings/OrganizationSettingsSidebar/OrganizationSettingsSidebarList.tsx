export interface OrganizationSettingsSidebarListInterface {
  id: number;
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
    id: 1,
    name: 'General Info',
    label: 'api-manager-general-info-tooltip',
    link: `/${organization}/organization-settings/general-info`,
    showToolTip: false,
    ToolTipValue: 'General Info',
  },
];
