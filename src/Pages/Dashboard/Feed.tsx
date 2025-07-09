import { FaFilter } from 'react-icons/fa';
import { FaPenToSquare } from 'react-icons/fa6';

import FeedPostCard from '../../Components/FeedPostCard';
import FeedPostLoader from '../../Components/Loader/FeedPostLoader';
import { OrganizationFeedPropsInterface } from '../../interface/Dashboard';

function Feed(props: OrganizationFeedPropsInterface) {
  const {
    setShowAddEditPostModal,
    feedPostData,
    GlobalStateProvider,
    loading,
    editPostHandler,
    handelClickOnDeleteButton,
  } = props;
  return (
    <div className='w-full bg-white relative flex flex-col items-start justify-start max-h-[calc(100vh-60px)] overflow-auto hide-scrollbar'>
      {/* Header Section */}
      <div className='w-full  flex items-stretch justify-between px-3.5 py-3 border-b border-b-black/15 min-h-[60px] h-[60px] sticky top-0 left-0 bg-white z-20'>
        <p className='text-xl text-black font-inter font-semibold flex flex-col items-center justify-center'>
          Feed
        </p>
        <div className='flex items-stretch justify-end gap-2'>
          <button
            className='font-inter text-white font-medium bg-[var(--them-green-color)] px-3 py-1 text-base rounded-md flex items-center justify-between gap-2'
            onClick={() => setShowAddEditPostModal(true)}
          >
            <FaPenToSquare />
            <span>Publish</span>
          </button>
          <button className='text-black text-base px-3 border border-black/15 rounded-md hover:bg-gray-100'>
            <FaFilter className='text-sm' />
          </button>
        </div>
      </div>
      {loading ? (
        <FeedPostLoader />
      ) : (
        <div className='w-full'>
          <div className='w-full flex flex-col items-start justify-start gap-4 px-4 py-4'>
            {feedPostData?.map((item) => {
              return (
                <div key={item?.id} className='w-full'>
                  <FeedPostCard
                    data={item}
                    GlobalStateProvider={GlobalStateProvider}
                    editPostHandler={editPostHandler}
                    handelClickOnDeleteButton={handelClickOnDeleteButton}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Feed;
