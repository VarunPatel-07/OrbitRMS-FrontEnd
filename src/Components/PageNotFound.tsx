function PageNotFound() {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='bg-white w-full max-w-[500px] p-6 rounded-lg shadow-lg text-center'>
        <h2 className='font-inter text-3xl text-blue-600 font-bold'>
          404 - Page Not Found
        </h2>
        <p className='text-base text-black/70 mt-3'>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => (window.location.href = '/config/project-status')}
          className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition'
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export default PageNotFound;
