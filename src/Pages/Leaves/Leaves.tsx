import { Route, Routes } from 'react-router-dom';

import ManageSelfLeave from './ManageSelfLeave';

function Leaves() {
  return (
    <div className='w-full h-full'>
      <Routes>
        <Route path='/self' element={<ManageSelfLeave />} />
      </Routes>
    </div>
  );
}

export default Leaves;
