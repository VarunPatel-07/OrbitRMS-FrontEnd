import { appRouterArraysInterface } from '@/interface/Global.interface';
import ApiManager from '@/modules/apiManager/ApiManager';
import AttendanceModule from '@/modules/Attendance';
import ClientInquiry from '@/modules/clientInquiry/ClientInquiry';
import Dashboard from '@/modules/dashboard/Dashboard';
import EmployeeListing from '@/modules/employee/EmployeeListing';
import AddEditEmployeeProfile from '@/modules/employeeProfile/AddEditEmployeeProfile/AddEditEmployeeProfile';
import EmployeeProfile from '@/modules/employeeProfile/EmployeeProfile';
import Leaves from '@/modules/leaves/Leaves';
import OrganizationSettings from '@/modules/organizationSettings/OrganizationSettings';
import SocialMedia from '@/modules/socialMedia/SocialMedia';

import Config from '@/modules/config/Config';

export const APPS_ROUTES_MODULE_ARRAY: appRouterArraysInterface[] = [
  {
    label: 'dashboard',
    path: '/dashboard',
    module: <Dashboard />,
    subModule: [],
  },
  {
    label: 'dashboard',
    path: '/attendance/*',
    module: <AttendanceModule />,
    subModule: [],
  },
  {
    label: 'dashboard',
    path: '/leaves/*',
    module: <Leaves />,
    subModule: [],
  },
  {
    label: 'employees',
    path: '/employees',
    module: null,
    subModule: [
      {
        label: 'employee_profile',
        path: '/employees/employee-profile/:id/*',
        module: <EmployeeProfile />,
        subModule: [],
      },
      {
        label: 'employee_profile',
        path: '/employees/manage/:type/:id?',
        module: <AddEditEmployeeProfile />,
        subModule: [],
      },
      {
        label: 'employee_listing',
        path: '/employees/employee-listing',
        module: <EmployeeListing />,
        subModule: [],
      },
    ],
  },
  {
    label: 'client_inquiry',
    path: '/client-inquiry',
    module: <ClientInquiry />,
    subModule: [],
  },
  {
    label: 'social_media',
    path: '/social-media',
    module: <SocialMedia />,
    subModule: [],
  },
  {
    label: 'config',
    path: '/config/*',
    module: <Config />,
    subModule: [],
  },
  {
    label: 'api_manager',
    path: '/api-manager/*',
    module: <ApiManager />,
    subModule: [],
  },
  {
    label: 'organization_settings',
    path: '/organization-settings/*',
    module: <OrganizationSettings />,
    subModule: [],
  },
];
