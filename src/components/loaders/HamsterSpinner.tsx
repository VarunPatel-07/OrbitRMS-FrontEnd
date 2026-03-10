import '@/styles/hamster-loader.css';

function HamsterSpinner({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <div
      title='Orange and tan hamster running in a metal wheel'
      role='img'
      className='wheel-and-hamster'
    >
      <div
        className={`wheel ${theme === 'dark' ? 'wheel-dark' : 'wheel-light'}`}
      ></div>
      <div className='hamster'>
        <div className='hamster__body'>
          <div className='hamster__head'>
            <div className='hamster__ear'></div>
            <div className='hamster__eye'></div>
            <div className='hamster__nose'></div>
          </div>
          <div className='hamster__limb hamster__limb--fr'></div>
          <div className='hamster__limb hamster__limb--fl'></div>
          <div className='hamster__limb hamster__limb--br'></div>
          <div className='hamster__limb hamster__limb--bl'></div>
          <div className='hamster__tail'></div>
        </div>
      </div>
      <div
        className={`spoke ${theme === 'dark' ? 'spoke-dark' : 'spoke-light'}`}
      ></div>
    </div>
  );
}

export default HamsterSpinner;
