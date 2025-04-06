import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import PageNotFound from '../../Components/PageNotFound';
import ProtectedRoute from '../../Helper/ProtectedRoute';
import AttachmentTypes from './ConfigModulePages/AttachmentTypes';
import Designations from './ConfigModulePages/Designations';
import ProjectStatus from './ConfigModulePages/ProjectStatus';
import RolesAndPermission from './ConfigModulePages/RolesAndPermission/RolesAndPermission';
import ViewPermissions from './ConfigModulePages/RolesAndPermission/ViewPermissions';
import ConfigSidebar from './ConfigSidebar/ConfigSidebar';

function Config() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/config') {
      navigate('/config/project-status');
    }
  }, [location.pathname, navigate]);

  return (
    <div className='w-full h-full'>
      <div className='w-full h-full flex items-stretch justify-start'>
        <div className='w-[30%] max-w-[300px]'>
          <ConfigSidebar />
        </div>

        <div className='flex-1 overflow-auto'>
          <Routes>
            <Route
              path='/project-status'
              element={<ProtectedRoute element={<ProjectStatus />} />}
            />
            <Route
              path='/attachment-type'
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
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Config;
