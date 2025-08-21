import { FaPlus } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';

import Button from '../../common/Button';
import { ConnectedPlatformsInterface } from '../../interface/SocialMediaModule';
import SocialMediaCard from './SocialMediaModuleHelper/SocialMediaCard';
import { SocialMediaModuleModalArrayList } from './SocialMediaModuleModal/SocialMediaModuleModalArrayList';

function ConnectedPlatforms(props: ConnectedPlatformsInterface) {
  const {
    GlobalStateProvider,
    loading,
    data,
    dropdownRefs,
    setShowModal,
    showModal,
    handelClickOnDropDown,
    setHandelClickOnDropDown,
    
  } = props;
  const SocialMediaModuleModalArray =
    SocialMediaModuleModalArrayList(GlobalStateProvider);
  return (
    <div className='flex flex-col items-start justify-start w-full'>
      <div className='w-full border-b border-b-black/30 pb-3'>
        <h2 className='text-black text-xl font-inter font-semibold'>
          Connected Platforms
        </h2>
      </div>
      <div className='flex items-center justify-start gap-4 pt-4'>
        {loading ? (
          <>
            {Array.from({ length: 3 })?.map((_, index) => (
              <div
                key={index}
                className='min-w-60 min-h-60 max-w-60 max-h-60 rounded-lg overflow-hidden'
              >
                <Skeleton width={240} height={240} className='inline-block' />
              </div>
            ))}
          </>
        ) : (
          <>
            {data?.map((data) => (
              <SocialMediaCard
                data={data}
                dropdownRefs={dropdownRefs}
                handelClickOnDropDown={handelClickOnDropDown}
                setHandelClickOnDropDown={setHandelClickOnDropDown}
                key={data?.id}
              />
            ))}
            {data?.length !== SocialMediaModuleModalArray?.length && (
              <Button
                type='button'
                className='min-w-52 min-h-52 max-w-52 max-h-52 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center border border-black/20'
                onClick={() => setShowModal(!showModal)}
              >
                <FaPlus className='w-10 h-10 text-black' />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ConnectedPlatforms;
