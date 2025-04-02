import RolesAndPermissionTable from './RolesAndPermissionTable';

interface Permission {
  label: string;
  is_allowed: boolean;
  show_input: boolean;
}

export interface RolesAndPermissionsModule {
  module_label: string;
  module_title: string;
  is_active: boolean;
  permissions: Permission[];
  sub_modules: RolesAndPermissionsModule[];
}

function RolesAndPermission() {
  const rolePermissions: RolesAndPermissionsModule[] = [
    {
      module_label: 'config',
      module_title: 'Configuration',
      is_active: true,
      permissions: [
        { label: 'view', is_allowed: true, show_input: true },
        { label: 'edit', is_allowed: true, show_input: true },
        { label: 'delete', is_allowed: true, show_input: false },
      ],
      sub_modules: [
        {
          module_label: 'project-status',
          module_title: 'Project Status',
          is_active: true,
          permissions: [
            { label: 'view', is_allowed: true, show_input: true },
            { label: 'edit', is_allowed: true, show_input: true },
            { label: 'delete', is_allowed: true, show_input: false },
          ],
          sub_modules: [
            {
              module_label: 'status-history',
              module_title: 'Status History',
              is_active: true,
              permissions: [
                { label: 'view', is_allowed: true, show_input: true },
                { label: 'edit', is_allowed: true, show_input: true },
                { label: 'delete', is_allowed: true, show_input: false },
              ],
              sub_modules: [], // Can have more nested levels if needed
            },
          ],
        },
        {
          module_label: 'attachment-type',
          module_title: 'Attachment Type',
          is_active: true,
          permissions: [
            { label: 'view', is_allowed: true, show_input: true },
            { label: 'edit', is_allowed: true, show_input: true },
            { label: 'delete', is_allowed: true, show_input: false },
          ],
          sub_modules: [],
        },
        {
          module_label: 'designations',
          module_title: 'Designations',
          is_active: true,
          permissions: [
            { label: 'view', is_allowed: true, show_input: true },
            { label: 'edit', is_allowed: true, show_input: true },
            { label: 'delete', is_allowed: true, show_input: false },
          ],
          sub_modules: [],
        },
      ],
    },
    {
      module_label: 'config',
      module_title: 'Configuration',
      is_active: true,
      permissions: [
        { label: 'view', is_allowed: true, show_input: true },
        { label: 'edit', is_allowed: true, show_input: true },
        { label: 'delete', is_allowed: true, show_input: false },
      ],
      sub_modules: [
        {
          module_label: 'project-status',
          module_title: 'Project Status',
          is_active: true,
          permissions: [
            { label: 'view', is_allowed: true, show_input: true },
            { label: 'edit', is_allowed: true, show_input: true },
            { label: 'delete', is_allowed: true, show_input: false },
          ],
          sub_modules: [
            {
              module_label: 'status-history',
              module_title: 'Status History',
              is_active: true,
              permissions: [
                { label: 'view', is_allowed: true, show_input: true },
                { label: 'edit', is_allowed: true, show_input: true },
                { label: 'delete', is_allowed: true, show_input: false },
              ],
              sub_modules: [], // Can have more nested levels if needed
            },
          ],
        },
        {
          module_label: 'attachment-type',
          module_title: 'Attachment Type',
          is_active: true,
          permissions: [
            { label: 'view', is_allowed: true, show_input: true },
            { label: 'edit', is_allowed: true, show_input: true },
            { label: 'delete', is_allowed: true, show_input: false },
          ],
          sub_modules: [],
        },
        {
          module_label: 'designations',
          module_title: 'Designations',
          is_active: true,
          permissions: [
            { label: 'view', is_allowed: true, show_input: true },
            { label: 'edit', is_allowed: true, show_input: true },
            { label: 'delete', is_allowed: true, show_input: false },
          ],
          sub_modules: [],
        },
      ],
    },
  ];

  return (
    <div>
      <h1 className='text-black font-bold uppercase'>roles and permission</h1>

      <RolesAndPermissionTable data={rolePermissions} />
    </div>
  );
}
    
export default RolesAndPermission;
