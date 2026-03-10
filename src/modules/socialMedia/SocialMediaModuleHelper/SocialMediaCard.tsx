import { BsThreeDotsVertical } from 'react-icons/bs';

import { SocialMediaCardInterface } from '@/interface/SocialMedia.interface';

import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import { GetPlatformLogo } from '@/utils/constants/socialMedia.constants';
import { classNames } from '@/utils/helpers/commonHelpers';

function SocialMediaCard(props: SocialMediaCardInterface) {
  const {
    data,
    dropdownRefs,
    setHandelClickOnDropDown,
    handelClickOnDropDown,
    loadingId,
    handelStatusToggler,
    disconnectLoaderId,
    handelDisconnectAccount,
  } = props;

  return (
    <div
      key={data?.id}
      ref={(el) => (dropdownRefs.current[data?.id] = el)}
      className='min-w-52 min-h-52 max-w-52 max-h-52 border border-black/20 rounded-lg flex flex-col items-center justify-center p-3 relative'
    >
      <div className='absolute left-0 top-3 w-full flex items-center justify-between px-3'>
        <span
          className={`border ${data?.is_active ? 'border-green-600 text-green-700 bg-green-50' : 'border-rose-600 text-rose-700 bg-rose-50'} text-xs font-semibold font-inter px-3 py-1 rounded-full`}
        >
          {data?.is_active ? 'Active' : 'Inactive'}
        </span>
        <div className='relative'>
          <Button
            type='button'
            className='text-black'
            onClick={() => setHandelClickOnDropDown(data?.id)}
          >
            <BsThreeDotsVertical />
          </Button>
          <ul
            className={classNames(
              'absolute top-0 left-0 mt-5 bg-white border border-black/20 rounded-md overflow-hidden z-30 origin-top',
              {
                'scale-y-0': handelClickOnDropDown !== data?.id,
                'scale-y-100': handelClickOnDropDown === data?.id,
              }
            )}
          >
            <li className='w-full'>
              <Button
                type='button'
                className='text-black text-sm font-inter px-2 py-1 h-full flex hover:bg-gray-200'
                onClick={() => handelStatusToggler(data?.id)}
              >
                {loadingId == data?.id ? (
                  <Loader
                    theme='dark'
                    loaderText={
                      data?.is_active ? 'Deactivating...' : 'Activating...'
                    }
                  />
                ) : (
                  <> {data?.is_active ? 'Deactivate' : 'Activate'}</>
                )}
              </Button>
            </li>
          </ul>
        </div>
      </div>
      <div className='w-full m-auto pt-11'>
        <div className='min-w-[50px] m-auto min-h-[50px] max-w-[50px] max-h-[50px]'>
          <img
            src={GetPlatformLogo[data?.platform]}
            alt='Facebook'
            width={50}
            height={50}
            loading='lazy'
          />
        </div>
      </div>
      <div className='flex flex-col items-center justify-end gap-3 flex-grow w-full'>
        <div className='w-full flex flex-col items-center justify-center gap-2'>
          <p className='text-black text-base font-inter font-medium'>
            {data?.account_name}
          </p>
        </div>
        <div className='flex flex-col items-start justify-center gap-1 w-full'>
          <Button
            type='button'
            className='bg-blue-700 text-white w-full rounded-md text-sm font-inter font-medium capitalize py-1.5 px-2'
            disabled={disconnectLoaderId == data?.id}
            onClick={() => handelDisconnectAccount(data?.id)}
          >
            {disconnectLoaderId == data?.id ? (
              <Loader loaderText='Disconnecting...' />
            ) : (
              'disconnect'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SocialMediaCard;
