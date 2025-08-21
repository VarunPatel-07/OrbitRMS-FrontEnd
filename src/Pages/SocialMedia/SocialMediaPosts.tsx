import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import DefaultLotiAnimation from '../../assets/lottie/DefaultAnimation.lottie';
import Button from '../../common/Button';
import { SocialMedialPostComponentInterface } from '../../interface/SocialMediaModule';
import SocialMediaPostCard from './SocialMediaModuleHelper/SocialMediaPostCard';

function SocialMediaPosts(props: SocialMedialPostComponentInterface) {
  const {
    setShowAddEditPostModal,
    socialPostArray,
    handelClickOnDeleteButton,
  } = props;
  return (
    <div className='w-full h-full rounded-lg flex flex-col'>
      <div className='flex items-center justify-between w-full px-5 py-3.5 bg-white rounded-t-lg border border-black/20 sticky top-0 z-20 '>
        <div className='flex-grow'>
          <h2 className='text-black text-xl font-inter font-semibold'>
            Scheduled & Published Posts{' '}
          </h2>
        </div>
        <Button
          type='button'
          className='px-4 py-1.5 bg-[var(--them-green-light-color)] rounded-lg text-base w-fit text-nowrap'
          onClick={() => setShowAddEditPostModal(true)}
        >
          Post Content
        </Button>
      </div>

      {socialPostArray?.length <= 0 ? (
        <div className='w-full h-full px-5 py-3 bg-white rounded-b-lg border border-t-0 overflow-auto border-black/20'>
          <div className='w-full h-full flex flex-col items-center justify-center gap-3.5'>
            <span className='bg-gradient-to-b from-[#f5f7f7] to-[#eaedf0] p-2 flex items-center justify-center max-w-[60px] max-h-[60px] overflow-hidden rounded-full'>
              <DotLottieReact
                src={DefaultLotiAnimation}
                loop
                autoplay
                height={55}
                width={55}
              />
            </span>
            <div className='flex flex-col items-center justify-center gap-1'>
              <h2 className='font-inter text-lg font-semibold text-black tracking-tight'>
                No Scheduled or Published Posts
              </h2>
              <p className='text-base font-inter text-black/70'>
                Begin by adding a post to establish your feed.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className='w-full pb-5'>
          <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-white px-5 py-5 rounded-b-lg border border-black/20 border-t-0'>
            {socialPostArray?.map((data) => (
              <SocialMediaPostCard
                key={data?.id}
                data={data}
                handelClickOnDeleteButton={handelClickOnDeleteButton}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SocialMediaPosts;
