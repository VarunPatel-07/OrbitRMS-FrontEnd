import OrbitRMSLogo from '../../assets/Images/orbitrms-final-logo-transperent.webp';

function Navbar() {
  return (
    <div className='w-full h-14 flex items-center justify-between border-b border-b-black/10'>
      <div className='h-full flex w-fit gap-3'>
        <div className='w-fit pl-4 flex items-center justify-center'>
          <img
            src={OrbitRMSLogo}
            width={150}
            className='w-36 h-10 object-cover'
            alt=''
          />
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
