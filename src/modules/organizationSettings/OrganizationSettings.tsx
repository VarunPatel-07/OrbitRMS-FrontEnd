import { useContext, useEffect } from 'react';

import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '@/contexts/globalState/GlobalStateContectApi';
import OrganizationSettingsSidebar from '@/modules/organizationSettings/OrgSettingsSidebar';
import GeneralInfo from '@/modules/organizationSettings/screens/GeneralInfo';
import LeavesManager from '@/modules/organizationSettings/screens/LeavesManager';

import { getDataFromLocalStorage } from '@/utils/helpers/commonHelpers';
import ProtectedRoute from '@/utils/helpers/ProtectedRoute';

import Holidays from './screens/Holidays';
import OrganizationLocationConfig from './screens/OrganizationLocationConfig';

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
              path='/general-info'
              element={<ProtectedRoute element={<GeneralInfo />} />}
            />
            <Route
              path='/holiday'
              element={<ProtectedRoute element={<Holidays />} />}
            />
            <Route
              path='/leaves-manager'
              element={<ProtectedRoute element={<LeavesManager />} />}
            />
            <Route
              path='/org-location-config'
              element={
                <ProtectedRoute element={<OrganizationLocationConfig />} />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default OrganizationSettings;
