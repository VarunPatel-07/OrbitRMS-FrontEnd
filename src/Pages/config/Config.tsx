import { useContext, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import PageNotFound from '../../Components/PageNotFound';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../Context/globalState/GlobalStateContectApi';
import ProtectedRoute from '../../Helper/ProtectedRoute';
import ClientFormSchema from './ConfigModulePages/ClientFormSchema';
import AttachmentTypes from './ConfigModulePages/Department';
import Designations from './ConfigModulePages/Designations';
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
  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug;

  useEffect(() => {
    if (location.pathname == `/${organization}/config`) {
      navigate(`/${organization}/config/project-status`);
    }
  }, [location.pathname, navigate, organization]);

  return (
    <div className='w-full h-full'>
      <div className='w-full h-full flex items-stretch justify-start'>
        <div className='w-[30%] max-w-[300px] border-r border-r-black/15'>
          <ConfigSidebar />
        </div>

        <div className='flex-1 overflow-auto'>
          <Routes>
            <Route
              path='/project-status'
              element={<ProtectedRoute element={<ProjectStatus />} />}
            />
            <Route
              path='/department'
              element={<ProtectedRoute element={<AttachmentTypes />} />}
            />
            <Route
              path='/designations'
              element={<ProtectedRoute element={<Designations />} />}
            />
            <Route
              path='/roles-permission'
              element={<ProtectedRoute element={<RolesAndPermission />} />}
            />
            <Route
              path='/roles-permission/:id'
              element={<ProtectedRoute element={<ViewPermissions />} />}
            />
            <Route
              path='/client-form'
              element={<ProtectedRoute element={<ClientFormSchema />} />}
            />
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Config;
