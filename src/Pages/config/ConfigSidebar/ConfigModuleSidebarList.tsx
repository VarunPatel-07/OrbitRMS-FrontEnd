export interface ConfigModuleSidebarInterface {
  id: string;
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
    id: 'project_status',
    name: 'Project Status',
    label: 'config-project-status-tooltip',
    link: `/${organization}/config/project-status`,
    showToolTip: false,
    ToolTipValue: 'Project Status',
  },
  {
    id: 'department',
    name: 'Department',
    label: 'config-attachment-type-tooltip',
    link: `/${organization}/config/department`,
    showToolTip: false,
    ToolTipValue: 'Attachment Type',
  },
  {
    id: 'designations',
    name: 'Designations',
    label: 'config-designations-tooltip',
    link: `/${organization}/config/designations`,
    showToolTip: false,
    ToolTipValue: 'Designations',
  },
  {
    id: 'roles_permission',
    name: 'Roles & Permission',
    label: 'config-roles-permission-tooltip',
    link: `/${organization}/config/roles-permission`,
    showToolTip: false,
    ToolTipValue: 'Roles & Permission',
  },
  {
    id: 'inquiry_forms',
    name: 'Inquiry Forms',
    label: 'config-client-form-tooltip',
    link: `/${organization}/config/inquiry-forms`,
    showToolTip: false,
    ToolTipValue: 'Client Form',
  },
];
