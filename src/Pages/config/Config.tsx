import React, { useContext, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import AccessDeniedRedirect from '../../Components/AccessDeniedRedirect';
import PageNotFound from '../../Components/PageNotFound';
import { MetaTitleDescription } from '../../constant/MetaTitleDescription';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../Context/globalState/GlobalStateContectApi';
import HelmetSeo from '../../Helper/HelmetSeo';
import { getDataFromLocalStorage } from '../../Helper/HelperFunctions';
import ProtectedRoute from '../../Helper/ProtectedRoute';
import { ConfigModuleSideBarListingInterface } from '../../interface/interface';
import AttachmentTypes from './ConfigModulePages/Department';
import Designations from './ConfigModulePages/Designations';
import InquiryFormFields from './ConfigModulePages/InquiryForm/InquiryFormFields';
import InquiryFormSchema from './ConfigModulePages/InquiryForm/InquiryFormSchema';
import ProjectStatus from './ConfigModulePages/ProjectStatus';
import RolesAndPermission from './ConfigModulePages/RolesAndPermission/RolesAndPermission';
import ViewPermissions from './ConfigModulePages/RolesAndPermission/ViewPermissions';
import ConfigSidebar from './ConfigSidebar/ConfigSidebar';

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
        Title={MetaTitleDescription.configModule.title}
        Content={MetaTitleDescription.configModule.description}
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
