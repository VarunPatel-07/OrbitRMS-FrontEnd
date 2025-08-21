import { ReactElement } from 'react';
import { FaHashtag, FaProjectDiagram, FaUser } from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5';
import { LuBuilding2 } from 'react-icons/lu';
import { MdAssignment, MdSpaceDashboard } from 'react-icons/md';

export interface SidebarMenuItemInterface {
  id: number;
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
    id: 1,
    name: 'Dashboard',
    icon: <MdSpaceDashboard className='w-6 h-6' />,
    label: 'data-tooltip-dashboard',
    link: `/${organization}/dashboard`,
    protected: true,
    showToolTip: true,
    ToolTipValue: 'Dashboard',
  },
  {
    id: 2,
    name: 'Employees',
    icon: <FaUser className='w-5 h-5 mx-auto' />,
    label: 'data-tooltip-employee-listing',
    link: `/${organization}/employee/employee-listing`,
    protected: true,
    showToolTip: true,
    ToolTipValue: 'Employees',
  },
  {
    id: 3,
    name: 'Client Inquiry',
    icon: <MdAssignment className='w-6 h-6' />,
    label: 'data-tooltip-client-inquiry',
    link: `/${organization}/client-inquiry`,
    protected: true,
    showToolTip: true,
    ToolTipValue: 'Client Inquiry',
  },
  {
    id: 4,
    name: 'Social Media',
    icon: <FaHashtag className='w-5 h-5' />,
    label: 'data-tooltip-social-media',
    link: `/${organization}/social-media`,
    protected: true,
    showToolTip: true,
    ToolTipValue: 'Social Media',
  },
  {
    id: 5,
    name: 'Config',
    icon: <IoSettings className='w-6 h-6' />,
    label: 'data-tooltip-settings',
    link: `/${organization}/config/project-status`,
    protected: true,
    showToolTip: true,
    ToolTipValue: 'Config',
  },
  {
    id: 6,
    name: 'Api Manager',
    icon: <FaProjectDiagram className='w-6 h-6' />,
    label: 'data-tooltip-api-manager',
    link: `/${organization}/api-manager/client-inquiry`,
    protected: true,
    showToolTip: true,
    ToolTipValue: 'Api Manager',
  },
  {
    id: 7,
    name: 'Organization Settings',
    icon: <LuBuilding2 className='w-6 h-6' />,
    label: 'data-tooltip-organization-setting',
    link: `/${organization}/organization-settings`,
    protected: true,
    showToolTip: true,
    ToolTipValue: 'Organization Settings',
  },
];
