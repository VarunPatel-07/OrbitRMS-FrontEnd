import { useContext, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../Context/globalState/GlobalStateContectApi';
import { getDataFromLocalStorage } from '../../Helper/HelperFunctions';
import ProtectedRoute from '../../Helper/ProtectedRoute';
import ProjectStatus from '../config/ConfigModulePages/ProjectStatus';
import OrganizationSettingsSidebar from './OrganizationSettingsSidebar/OrganizationSettingsSidebar';

function OrganizationSettings() {
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
    if (location.pathname == `/${organization}/organization-settings`) {
      navigate(`/${organization}/organization-settings/general-info`);
    }
  }, [location.pathname, navigate, organization]);

  return (
    <div className='w-full h-full'>
      <div className='w-full h-full flex items-stretch justify-start'>
        <div className='w-[30%] max-w-[300px] border-r border-r-black/15'>
          <OrganizationSettingsSidebar />
        </div>

        <div className='flex-1 overflow-auto'>
          <Routes>
            <Route
              path='/project-status'
              element={<ProtectedRoute element={<ProjectStatus />} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default OrganizationSettings;
