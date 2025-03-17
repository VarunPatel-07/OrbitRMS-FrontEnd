import { Route, Routes } from 'react-router-dom';

import ProtectedRoute from '../../Helper/ProtectedRoute';
import ProjectStatus from './ConfigModulePages/ProjectStatus';
import ConfigSidebar from './ConfigSidebar/ConfigSidebar';

function Config() {
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
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Config;
