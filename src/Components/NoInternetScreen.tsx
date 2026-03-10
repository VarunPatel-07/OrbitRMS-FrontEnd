export default function NoInternetScreen() {
  return (
    <div className='bg-white min-h-screen flex items-center justify-center px-5 text-center'>
      <div className='max-w-sm'>
        <div className='text-5xl mb-6 text-gray-800'>⊘</div>
        <h1 className='text-xl font-normal text-gray-900 mb-3'>
          No Internet Connection
        </h1>
        <p className='text-sm text-gray-500 leading-relaxed mb-8'>
          You appear to be offline. Please check your network connection and try
          again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className='bg-gray-900 text-white text-sm px-7 py-2.5 hover:bg-gray-700 transition-colors duration-150'
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
