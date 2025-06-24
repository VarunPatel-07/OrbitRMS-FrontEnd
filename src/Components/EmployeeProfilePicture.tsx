import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import defaultProfilePicture from '../assets/SVG-Images/default-profile-image.svg';
import { EmployeeProfilePictureInterface } from '../interface/interface';

function EmployeeProfilePicture(props: EmployeeProfilePictureInterface) {
  const { width, height, profilePicture = '', isLoading } = props;
  return (
    <div className='w-full flex items-center justify-center'>
      <div
        className='w-full h-full rounded-full overflow-hidden outline outline-1 outline-black/10 bg-black/50'
        style={{
          minWidth: `${width}px`,
          minHeight: `${height}px`,
          maxHeight: `${width}px`,
          maxWidth: `${height}px`,
        }}
      >
        {isLoading ? (
          <div className='-mt-3 w-full h-full'>
            <SkeletonTheme baseColor='#dcdce3' highlightColor='#ebebeb'>
              <Skeleton height={width + 100} width={height + 100} />
            </SkeletonTheme>
          </div>
        ) : (
          <>
            {profilePicture?.trim() != '' ? (
              <img
                src={profilePicture}
                alt='Default Employee Profile Picture'
                width={width}
                height={height}
                loading='lazy'
              />
            ) : (
              <img
                src={defaultProfilePicture}
                alt='Default Employee Profile Picture'
                width={width}
                height={height}
                loading='lazy'
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default EmployeeProfilePicture;
