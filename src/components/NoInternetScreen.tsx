import OrbitRMSLogo from '@/assets/images/orbitrms-final-logo-transperent.webp';

export default function NoInternetScreen() {
  return (
    <div className='bg-white min-h-screen flex flex-col'>
      {/* Header with logo */}

      {/* Centered content */}
      <div className='flex-1 flex flex-col gap-16 items-center justify-center px-5'>
        <div className='w-fit pl-4 pt-4 flex items-center justify-center'>
          <img
            src={OrbitRMSLogo}
            width={150}
            className='w-36 h-10 object-cover'
            alt='OrbitRMS Logo'
          />
        </div>
        <div className='max-w-sm text-center'>
          {/* Animated icon */}
          <div className='relative mx-auto mb-8 w-20 h-20'>
            <div className='absolute inset-0 rounded-full border-2 border-gray-200' />
            <div className='absolute inset-0 flex items-center justify-center'>
              <svg
                className='w-8 h-8 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3 3l18 18M8.111 8.111A5.97 5.97 0 006 12a6 6 0 006 6 5.97 5.97 0 003.889-1.889M15.536 8.464A5.97 5.97 0 0118 12a5.97 5.97 0 01-.464 2.286M1.5 1.5l.82.82M21 12a9 9 0 01-9 9 8.965 8.965 0 01-5.303-1.697M3.697 5.697A8.965 8.965 0 003 12c0 4.97 4.03 9 9 9'
                />
              </svg>
            </div>
            {/* Pulsing ring */}
            <div className='absolute inset-0 rounded-full border border-gray-100 animate-ping opacity-50' />
          </div>

          <h1 className='text-xl font-semibold text-gray-900 mb-3 tracking-tight'>
            No Internet Connection
          </h1>
          <p className='text-sm text-gray-400 leading-relaxed mb-8'>
            You appear to be offline. Please check your network connection and
            try again.
          </p>

          <button
            onClick={() => window.location.reload()}
            className='inline-flex items-center gap-2 bg-gray-900 text-white text-sm px-7 py-2.5 hover:bg-gray-700 active:scale-95 transition-all duration-150'
          >
            <svg
              className='w-3.5 h-3.5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
              />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
