import { BreadcrumbsConstantObjectInterface } from '@/interface/Global.interface';

export const ORGANIZATION_SETTINGS_BREADCRUMBS: BreadcrumbsConstantObjectInterface =
  {
    ORG_LOCATION_CONFIG: (organization: string) => [
      { name: 'Home', label: 'home', link: `/${organization}/dashboard` },
      {
        name: 'Organization Settings',
        label: 'organization-settings',
        link: `/${organization}/organization-settings/general-info`,
      },
      {
        name: 'Org Location Config',
        label: 'org-location-config',
        link: `/${organization}/organization-settings/org-location-config`,
      },
    ],
    ORG_LEAVES_MANAGER: (organization: string) => [
      { name: 'Home', label: 'home', link: `/${organization}/dashboard` },
      {
        name: 'Organization Settings',
        label: 'organization-settings',
        link: `/${organization}/organization-settings/general-info`,
      },
      {
        name: 'Leaves Manager',
        label: 'holiday',
        link: `/${organization}/organization-settings/leaves-manager`,
      },
    ],
    ORG_HOLIDAYS: (organization: string) => [
      { name: 'Home', label: 'home', link: `/${organization}/dashboard` },
      {
        name: 'Organization Settings',
        label: 'organization-settings',
        link: `/${organization}/organization-settings/general-info`,
      },
      {
        name: 'Holiday',
        label: 'holiday',
        link: `/${organization}/organization-settings/holiday`,
      },
    ],
  };
