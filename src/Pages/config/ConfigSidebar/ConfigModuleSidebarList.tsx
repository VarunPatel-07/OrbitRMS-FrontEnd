export interface ConfigModuleSidebarInterface {
  id: number;
  name: string;
  label: string;
  link: string;
  showToolTip: boolean;
  ToolTipValue: string;
}

export const ConfigSidebarMenuList = (
  organization: string
): ConfigModuleSidebarInterface[] => [
  {
    id: 1,
    name: 'Project Status',
    label: 'config-project-status-tooltip',
    link: `/${organization}/config/project-status`,
    showToolTip: false,
    ToolTipValue: 'Project Status',
  },
  {
    id: 2,
    name: 'Attachment Type',
    label: 'config-attachment-type-tooltip',
    link: `/${organization}/config/attachment-type`,
    showToolTip: false,
    ToolTipValue: 'Attachment Type',
  },
  {
    id: 3,
    name: 'Designations',
    label: 'config-designations-tooltip',
    link: `/${organization}/config/designations`,
    showToolTip: false,
    ToolTipValue: 'Designations',
  },
  {
    id: 4,
    name: 'Roles & Permission',
    label: 'config-roles-permission-tooltip',
    link: `/${organization}/config/roles-permission`,
    showToolTip: false,
    ToolTipValue: 'Roles & Permission',
  },
];
