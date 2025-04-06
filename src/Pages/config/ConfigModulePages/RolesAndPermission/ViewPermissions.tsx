// import { useParams } from 'react-router-dom';

import Breadcrumbs from '../../../../common/Breadcrumbs';
import RolesAndPermissionTable from './RolesAndPermissionTable';

const BreadcrumbsObjects = [
  { name: 'Home', label: 'home', link: '/home' },
  { name: 'Config', label: 'config-module', link: '/config/project-status' },
  { name: 'Roles', label: 'role-permission', link: '/config/roles-permission' },
];

function ViewPermissions() {
  //   const { id } = useParams();

  const modules = [
    {
      id: '7776400b-f56c-4165-a51b-54e42df058a1',
      module_label: 'dashboard',
      module_title: 'Dashboard',
      is_active: true,
      permissions: [
        {
          id: '083b7413-5988-4368-8c7e-035d98502e30',
          label: 'view',
          is_allowed: true,
          show_input: false,
        },
        {
          id: '77586379-dd4c-4b32-bcac-5977b8ca9932',
          label: 'delete',
          is_allowed: true,
          show_input: false,
        },
        {
          id: 'abfba4ae-1bd3-47a4-978b-bc13d6d3454f',
          label: 'edit',
          is_allowed: true,
          show_input: false,
        },
      ],
      sub_modules: [],
    },
    {
      id: 'b56d3631-fec7-4d08-bb51-d71e0fefbddd',
      module_label: 'config_module',
      module_title: 'Config Module',
      is_active: true,
      permissions: [
        {
          id: '2889fe13-09f5-440f-a61a-e484e1f791b4',
          label: 'delete',
          is_allowed: true,
          show_input: false,
        },
        {
          id: '50cd0e94-71cc-4951-aadb-1b3efd6f0062',
          label: 'edit',
          is_allowed: true,
          show_input: false,
        },
        {
          id: 'c8465422-fdb3-43a0-b110-4b7996a57f16',
          label: 'view',
          is_allowed: true,
          show_input: false,
        },
      ],
      sub_modules: [
        {
          id: '4e0cb4c2-1b39-4575-b574-65303bc8b3cb',
          module_label: 'roles_permission',
          module_title: 'Roles & Permission',
          is_active: true,
          permissions: [
            {
              id: '46ec4961-0049-4e51-8f80-e1e89970b959',
              label: 'delete',
              is_allowed: true,
              show_input: true,
            },
            {
              id: '4d731502-d586-47a5-98ed-3ceec29114ce',
              label: 'edit',
              is_allowed: true,
              show_input: true,
            },
            {
              id: 'a27611b8-03d7-4c98-830c-d7379a0b1291',
              label: 'view',
              is_allowed: true,
              show_input: true,
            },
          ],
          sub_modules: [],
        },
        {
          id: '7ffb48fa-64d6-4c9b-b586-d3509ed15dc9',
          module_label: 'attachment_type',
          module_title: 'Attachment Type',
          is_active: true,
          permissions: [
            {
              id: '6febbda0-b356-43f4-b903-9dd217afce6c',
              label: 'edit',
              is_allowed: true,
              show_input: true,
            },
            {
              id: '9bc9e9b9-4af3-4158-9360-caca0c372227',
              label: 'view',
              is_allowed: true,
              show_input: true,
            },
            {
              id: 'fda86a7b-c3e6-493b-9ad0-41fbed06402a',
              label: 'delete',
              is_allowed: true,
              show_input: true,
            },
          ],
          sub_modules: [],
        },
        {
          id: 'bdd69212-234d-48c9-b1eb-ffe9deeb848a',
          module_label: 'designations',
          module_title: 'Designations',
          is_active: true,
          permissions: [
            {
              id: '32199095-c935-4399-93bc-510672ae0e37',
              label: 'view',
              is_allowed: true,
              show_input: true,
            },
            {
              id: '44225e02-3596-417d-8c9c-87c5cd000556',
              label: 'edit',
              is_allowed: true,
              show_input: true,
            },
            {
              id: 'c0faab90-2160-4146-ad52-e8126e4aee69',
              label: 'delete',
              is_allowed: true,
              show_input: true,
            },
          ],
          sub_modules: [],
        },
        {
          id: 'e9b66960-93bf-478c-9cd5-ea58d15bb53d',
          module_label: 'project_status',
          module_title: 'Project Status',
          is_active: true,
          permissions: [
            {
              id: '4f186ce3-91e3-4d2e-995d-c8cbc82525f6',
              label: 'view',
              is_allowed: true,
              show_input: true,
            },
            {
              id: '9d463cf7-b5bf-4035-9208-c7eacf57f12b',
              label: 'delete',
              is_allowed: true,
              show_input: true,
            },
            {
              id: 'f5c1944d-39c4-46f9-b420-17ea077b046a',
              label: 'edit',
              is_allowed: true,
              show_input: true,
            },
          ],
          sub_modules: [],
        },
      ],
    },
  ];
  return (
    <div className='w-full h-full relative'>
      <Breadcrumbs BreadcrumbsNavigationFlow={BreadcrumbsObjects} />
      <div className='w-full h-full pt-10'>
        <div className='w-full h-full p-4 2xl:p-5'>
          <RolesAndPermissionTable data={modules} />
        </div>
      </div>
    </div>
  );
}

export default ViewPermissions;
