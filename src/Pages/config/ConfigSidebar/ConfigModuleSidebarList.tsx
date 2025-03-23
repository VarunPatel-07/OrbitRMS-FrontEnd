export interface ConfigModuleSidebarInterface {
  id: number;
  name: string;
  label: string;
  link: string;
  showToolTip: boolean;
  ToolTipValue: string;
}

export const ConfigSidebarMenuList: ConfigModuleSidebarInterface[] = [
  {
    id: 1,
    name: 'Project Status',
    label: 'config-project-status-tooltip',
    link: '/config/project-status',
    showToolTip: false,
    ToolTipValue: 'Project Status',
  },
  {
    id: 2,
    name: 'Attachment Type',
    label: 'config-attachment-type-tooltip',
    link: '/config/attachment-type',
    showToolTip: false,
    ToolTipValue: 'Attachment Type',
  },
  {
    id: 3,
    name: 'Designations',
    label: 'config-designations-tooltip',
    link: '/config/designations',
    showToolTip: false,
    ToolTipValue: 'Designations',
  },
  {
    id: 4,
    name: 'Roles & Permission',
    label: 'config-roles-permission-tooltip',
    link: '/config/roles-permission',
    showToolTip: false,
    ToolTipValue: 'Roles & Permission',
  },
];
