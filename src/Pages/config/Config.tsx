import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import ComingSoon from '../../Components/ComingSoon';
import ProtectedRoute from '../../Helper/ProtectedRoute';
import AttachmentTypes from './ConfigModulePages/AttachmentTypes';
import Designations from './ConfigModulePages/Designations';
import ProjectStatus from './ConfigModulePages/ProjectStatus';
import ConfigSidebar from './ConfigSidebar/ConfigSidebar';
import PageNotFound from '../../Components/PageNotFound';

function Config() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/config') {
      navigate('/config/project-status');
    }
  }, [location.pathname]);

  return (
    <div className='w-full h-full'>
      <div className='w-full h-full flex items-stretch justify-start'>
        <div className='w-[30%] max-w-[300px]'>
          <ConfigSidebar />
        </div>

        <div className='w-full p-4 2xl:p-5'>
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
              element={<ProtectedRoute element={<ComingSoon />} />}
            />
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Config;
