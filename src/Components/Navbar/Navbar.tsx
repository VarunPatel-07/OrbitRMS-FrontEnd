import { PiDotsNineBold } from 'react-icons/pi';

import OrbitRMSLogo from '../../assets/Images/OrbitRMS-Final-Logo-transperent.png';

function Navbar() {
  return (
    <div className='w-full h-14 flex items-center justify-between border-b border-b-slate-100'>
      <div className='h-full flex w-fit gap-3'>
        <button className='w-[57px] h-full border-r border-r-slate-300 flex items-center justify-center'>
          <PiDotsNineBold className='text-black w-7 h-7' />
        </button>
        <div className='w-fit pl-2.5'>
          <img src={OrbitRMSLogo} width={150} className='w-36' alt='' />
        </div>
      </div>
      <div>
        <div className='profile-picture pr-4'>
          <div className='w-12 h-12 bg-blue-500 rounded-full'></div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
