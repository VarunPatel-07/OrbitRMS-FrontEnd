import React, { useContext, useEffect } from 'react';

import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '@/contexts/globalState/GlobalStateContectApi';
import { ConfigModuleSideBarListingInterface } from '@/interface/Global.interface';
import AccessDeniedRedirect from '@/routes/AccessDeniedRedirect';

import AttachmentTypes from '@/modules/config/ConfigModulePages/Department';
import Designations from '@/modules/config/ConfigModulePages/Designations';
import InquiryFormFields from '@/modules/config/ConfigModulePages/InquiryForm/InquiryFormFields';
import InquiryFormSchema from '@/modules/config/ConfigModulePages/InquiryForm/InquiryFormSchema';
import ProjectStatus from '@/modules/config/ConfigModulePages/ProjectStatus';
import RolesAndPermission from '@/modules/config/ConfigModulePages/RolesAndPermission/RolesAndPermission';
import ViewPermissions from '@/modules/config/ConfigModulePages/RolesAndPermission/ViewPermissions';
import ConfigSidebar from '@/modules/config/ConfigSidebar/ConfigSidebar';

import PageNotFound from '@/components/PageNotFound';
import { META_TITLE_DESCRIPTION } from '@/utils/constants/seo.constants';
import { getDataFromLocalStorage } from '@/utils/helpers/commonHelpers';
import HelmetSeo from '@/utils/helpers/HelmetSeo';
import ProtectedRoute from '@/utils/helpers/ProtectedRoute';

function Config() {
  const navigate = useNavigate();
  const location = useLocation();

  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;
  const localStorageData = getDataFromLocalStorage('organization-info');
  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug ||
    JSON.parse(localStorageData)?.portal_slug;

  useEffect(() => {
    if (location.pathname == `/${organization}/config`) {
      navigate(`/${organization}/config/project-status`);
    }
  }, [location.pathname, navigate, organization]);

  const segments = location.pathname.split('/').filter(Boolean);

  const currentSection = segments[1];

  const permissionData = GlobalStateProvider.roles_permissions.permissions.find(
    (item) => item.module_label == currentSection
  );

  const ConfigModuleSideBarListing: ConfigModuleSideBarListingInterface[] = [
    {
      label: 'project_status',
      path: 'project-status',
      module: <ProjectStatus />,
    },
    {
      label: 'department',
      path: 'department',
      module: <AttachmentTypes />,
    },
    {
      label: 'designations',
      path: 'designations',
      module: <Designations />,
    },
    {
      label: 'roles_permission',
      path: 'roles-permission',
      module: <RolesAndPermission />,
    },
    {
      label: 'roles_permission',
      path: 'roles-permission/:id',
      module: <ViewPermissions />,
    },
    {
      label: 'inquiry_forms',
      path: 'inquiry-forms',
      module: <InquiryFormSchema />,
    },
    {
      label: 'inquiry_forms',
      path: 'inquiry-forms/:id/fields',
      module: <InquiryFormFields />,
    },
  ];

  if (!permissionData || !permissionData.is_active) {
    return (
      <AccessDeniedRedirect
        message="You don't have permission For ConfigModule."
        isAccessDenied={!permissionData || !permissionData.is_active}
      />
    );
  }
  if (!permissionData) return null;
  return (
    <>
      <HelmetSeo
        Title={META_TITLE_DESCRIPTION.CONFIG_MODULE.title}
        Content={META_TITLE_DESCRIPTION.CONFIG_MODULE.description}
      />
      <div className='w-full h-full'>
        <div className='w-full h-full flex items-stretch justify-start'>
          <div className='w-[30%] max-w-[300px] border-r border-r-black/15'>
            <ConfigSidebar permissionData={permissionData} />
          </div>

          <div className='flex-1 overflow-auto'>
            <Routes>
              {ConfigModuleSideBarListing?.map((sideBarData) => {
                const modulePermission = permissionData?.sub_modules?.find(
                  (item) => item.module_label === sideBarData?.label
                );

                const hasViewPermission = modulePermission?.permissions?.some(
                  (perm) => perm.label === 'view' && perm.is_allowed
                );

                if (!hasViewPermission) return null;

                const moduleWithPermissionData = React.cloneElement(
                  sideBarData?.module,
                  {
                    permissions: modulePermission?.permissions || [],
                  }
                );

                return (
                  <Route
                    key={sideBarData?.path}
                    path={sideBarData?.path}
                    element={
                      <ProtectedRoute element={moduleWithPermissionData} />
                    }
                  />
                );
              })}

              <Route path='*' element={<PageNotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default Config;
