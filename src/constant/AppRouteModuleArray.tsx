import { appRouterArraysInterface } from '../interface/interface';
import ApiManager from '../Pages/ApiManager/ApiManager';
import ClientInquiry from '../Pages/ClientInquiry/ClientInquiry';
import Config from '../Pages/config/Config';
import Dashboard from '../Pages/Dashboard/Dashboard';
import EmployeeListing from '../Pages/Employee/EmployeeListing';
import AddEditEmployeeProfile from '../Pages/EmployeeProfile/AddEditEmployeeProfile/AddEditEmployeeProfile';
import EmployeeProfile from '../Pages/EmployeeProfile/EmployeeProfile';
import Leaves from '../Pages/Leaves/Leaves';
import OrganizationSettings from '../Pages/OrganizationSettings/OrganizationSettings';
import SocialMedia from '../Pages/SocialMedia/SocialMedia';

export const APPS_ROUTES_MODULE_ARRAY: appRouterArraysInterface[] = [
  {
    label: 'dashboard',
    path: '/dashboard',
    module: <Dashboard />,
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
