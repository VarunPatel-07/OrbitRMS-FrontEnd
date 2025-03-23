function ErrorFallback() {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='bg-white w-full max-w-[500px] p-6 rounded-lg shadow-lg text-center'>
        <h2 className='font-inter text-2xl text-red-600 font-bold'>
          ⚠️ Oops! Something Went Wrong
        </h2>
        <p className='text-base text-black/70 mt-3'>
          We encountered an unexpected issue. Please refresh the page or try
          again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className='mt-4 px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition'
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

export default ErrorFallback;
