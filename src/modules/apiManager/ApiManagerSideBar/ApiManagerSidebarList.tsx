export interface ApiManagerSidebarList {
  id: number;
  name: string;
  label: string;
  link: string;
  showToolTip: boolean;
  ToolTipValue: string;
}

export const ApiManagerSidebarList = (
  organization: string
): ApiManagerSidebarList[] => [
  {
    id: 1,
    name: 'Client Inquiry',
    label: 'api-manager-client-inquiry-tooltip',
    link: `/${organization}/api-manager/client-inquiry`,
    showToolTip: false,
    ToolTipValue: 'Client Inquiry API Manager',
  },
];
