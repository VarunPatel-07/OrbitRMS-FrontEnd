import { FaFilter } from 'react-icons/fa';
import { FaPenToSquare } from 'react-icons/fa6';

function Feed() {
  return (
    <div className='w-full h-full bg-white'>
      {/* Header Section */}
      <div className='w-full  flex items-stretch justify-between px-3.5 py-3 border-b border-b-black/15 h-[60px]'>
        <p className='text-xl text-black font-inter font-semibold flex flex-col items-center justify-center'>Feed</p>
        <div className='flex items-stretch justify-end gap-2'>
          <button className='font-inter text-white font-medium bg-[var(--them-green-color)] px-3 py-1 text-base rounded-md flex items-center justify-between gap-2'>
            <FaPenToSquare />
            <span>Publish</span>
          </button>
          <button className='text-black text-base px-3 border border-black/15 rounded-md hover:bg-gray-100'>
            <FaFilter className='text-sm' />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Feed;
