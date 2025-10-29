function UploadingPostDefaultLoader({
  stage,
  progress,
  theme = 'light',
}: {
  stage: 'parsing' | 'uploading' | 'processing' | 'done';
  progress: number;
  theme?: 'light' | 'dark';
}) {
  const isDark = theme === 'dark';

  return (
    <div
      className={`w-full flex items-center justify-start px-5 py-4 border-b rounded-xl shadow-sm gap-4 backdrop-blur-sm transition-all duration-700
      ${
        isDark
          ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-700/70'
          : 'bg-gradient-to-r from-white to-gray-50 border-gray-200/60'
      }`}
    >
      {/* Thumbnail / Loader Box */}
      <div
        className={`min-w-[50px] min-h-[50px] rounded-xl flex items-center justify-center shadow-inner relative overflow-hidden
        ${
          isDark
            ? 'bg-gradient-to-br from-gray-700 to-gray-600'
            : 'bg-gradient-to-br from-gray-100 to-gray-300'
        }`}
      >
        {stage === 'done' ? (
          <div className='w-8 h-8 text-green-500 font-semibold flex items-center justify-center animate-fadeIn'>
            ✓
          </div>
        ) : (
          <div
            className={`loader-glow w-8 h-8 rounded-full border-[3px] ${
              isDark
                ? 'border-gray-600 border-t-blue-400'
                : 'border-gray-300 border-t-blue-500'
            } animate-spin-smooth`}
          ></div>
        )}
      </div>

      {/* Text and Progress */}
      <div className='flex-1 flex flex-col justify-center'>
        <p
          className={`text-base font-medium mb-2 tracking-wide ${
            isDark ? 'text-gray-100' : 'text-gray-800'
          }`}
        >
          {stage === 'parsing'
            ? 'Analyzing your images...'
            : stage === 'uploading'
              ? 'Uploading in progress...'
              : stage === 'processing'
                ? 'Finalizing your upload...'
                : 'Upload complete!'}
        </p>

        {/* Progress / Animated Bars */}
        <div
          className={`w-full h-[5px] rounded-full overflow-hidden ${
            isDark ? 'bg-gray-700/70' : 'bg-gray-200/70'
          }`}
        >
          {stage === 'parsing' && (
            <div className='h-full bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 animate-shimmer'></div>
          )}

          {stage === 'uploading' && (
            <div
              className='h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 shadow-[0_0_10px_#3b82f680] transition-all duration-200'
              style={{ width: `${progress}%` }}
            ></div>
          )}

          {stage === 'processing' && (
            <div className='h-full bg-gradient-to-r from-green-400 to-green-600 animate-pulse'></div>
          )}

          {stage === 'done' && (
            <div className='h-full bg-gradient-to-r from-emerald-500 to-green-600 animate-fadeIn'></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadingPostDefaultLoader;
