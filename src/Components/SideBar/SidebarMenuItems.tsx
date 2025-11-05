import { ReactElement } from 'react';
import { FaHashtag, FaProjectDiagram, FaUser } from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5';
import { LuBuilding2 } from 'react-icons/lu';
import { MdAssignment, MdSpaceDashboard } from 'react-icons/md';

export interface SidebarMenuItemInterface {
  id:
    | 'dashboard'
    | 'employees'
    | 'client_inquiry'
    | 'social_media'
    | 'config'
    | 'api_manager'
    | 'organization_settings';
  name: string;
  label: string;
  icon: ReactElement;
  link: string;
  protected: boolean;
  showToolTip: boolean;
  ToolTipValue: string;
}

export const SidebarMenuItems = (
  organization: string
): SidebarMenuItemInterface[] => [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: <MdSpaceDashboard className='w-6 h-6' />,
    label: 'data-tooltip-dashboard',
    link: `/${organization}/dashboard`,
    protected: true,
    showToolTip: true,
    ToolTipValue: 'Dashboard',
  },
  {
    id: 'employees',
    name: 'Employees',
    icon: <FaUser className='w-5 h-5 mx-auto' />,
    label: 'data-tooltip-employee-listing',
    link: `/${organization}/employees/employee-listing`,
    protected: true,
    showToolTip: true,
    ToolTipValue: 'Employees',
  },
  {
    id: 'client_inquiry',
    name: 'Client Inquiry',
    icon: <MdAssignment className='w-6 h-6' />,
    label: 'data-tooltip-client-inquiry',
    link: `/${organization}/client-inquiry`,
    protected: true,
    showToolTip: true,
    ToolTipValue: 'Client Inquiry',
  },
  {
    id: 'social_media',
    name: 'Social Media',
    icon: <FaHashtag className='w-5 h-5' />,
    label: 'data-tooltip-social-media',
    link: `/${organization}/social-media`,
    protected: true,
    showToolTip: true,
    ToolTipValue: 'Social Media',
  },
  {
    id: 'config',
    name: 'Config',
    icon: <IoSettings className='w-6 h-6' />,
    label: 'data-tooltip-settings',
    link: `/${organization}/config/project-status`,
    protected: true,
    showToolTip: true,
    ToolTipValue: 'Config',
  },
  {
    id: 'api_manager',
    name: 'Api Manager',
    icon: <FaProjectDiagram className='w-6 h-6' />,
    label: 'data-tooltip-api-manager',
    link: `/${organization}/api-manager/client-inquiry`,
    protected: true,
    showToolTip: true,
    ToolTipValue: 'Api Manager',
  },
  {
    id: 'organization_settings',
    name: 'Organization Settings',
    icon: <LuBuilding2 className='w-6 h-6' />,
    label: 'data-tooltip-organization-setting',
    link: `/${organization}/organization-settings`,
    protected: true,
    showToolTip: true,
    ToolTipValue: 'Organization Settings',
  },
];
