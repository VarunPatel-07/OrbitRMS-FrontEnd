import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

interface EmployeeProfileListingLoaderInterface {
  showProfileLoader?: boolean;
  showAboutFiled?: boolean;
  childrenEmergencySection?: boolean;
  showAddressField?: boolean;
  showSocialLinkField?: boolean;
  tripleColumnFieldCount?: number;
  doubleColumnFieldCount?: number;
  singleColumnFieldCount?: number;
}

function AddEditProfileSkeletonLoader(
  props: EmployeeProfileListingLoaderInterface
) {
  const {
    showProfileLoader = false,
    showAboutFiled = false,
    childrenEmergencySection = false,
    showAddressField = false,
    showSocialLinkField = false,
    tripleColumnFieldCount = 0,
    doubleColumnFieldCount = 0,
    singleColumnFieldCount = 0,
  } = props;
  return (
    <SkeletonTheme baseColor='#dcdce3' highlightColor='#ebebeb'>
      <div className='bg-white rounded-xl'>
        <div className='flex items-start flex-col justify-start gap-1 p-5 border-b border-b-black/20'>
          <h2 className='font-inter text-xl text-black font-semibold capitalize'>
            <Skeleton width={280} height={28} className='inline-block' />
          </h2>
          <p className='font-inter text-sm text-black font-light w-[70%]'>
            <Skeleton width={'100%'} height={22} className='inline-block' />
          </p>
        </div>
        <div className='p-6 w-full'>
          <div className='grid grid-cols-1 gap-6'>
            {showProfileLoader && (
              <div className='w-full'>
                <Skeleton
                  width={'100%'}
                  height={160}
                  borderRadius={8}
                  className='inline-block'
                />
              </div>
            )}
            {showAddressField && (
              <div className='w-full'>
                <div className='w-full'>
                  <Skeleton
                    width={100}
                    height={12}
                    borderRadius={4}
                    className='inline-block'
                  />
                  <Skeleton
                    width={'100%'}
                    height={100}
                    borderRadius={8}
                    className='inline-block'
                  />
                </div>
              </div>
            )}
            {singleColumnFieldCount !== 0 &&
              Array.from({ length: singleColumnFieldCount }).map((_, index) => (
                <div className='w-full' key={index}>
                  <div className='w-full'>
                    <Skeleton
                      width={100}
                      height={12}
                      borderRadius={4}
                      className='inline-block'
                    />
                  </div>
                  <Skeleton
                    width={'100%'}
                    height={40}
                    borderRadius={8}
                    className='inline-block'
                  />
                </div>
              ))}
            {tripleColumnFieldCount !== 0 && (
              <div className='w-full'>
                <div className='w-full grid grid-cols-3 gap-5'>
                  {Array.from({ length: tripleColumnFieldCount }).map(
                    (_, index) => (
                      <div className='w-full' key={index}>
                        <div className='w-full'>
                          <Skeleton
                            width={100}
                            height={12}
                            borderRadius={4}
                            className='inline-block'
                          />
                        </div>
                        <Skeleton
                          width={'100%'}
                          height={40}
                          borderRadius={8}
                          className='inline-block'
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
            {doubleColumnFieldCount !== 0 && (
              <div className='w-full'>
                <div className='w-full grid grid-cols-2 gap-5'>
                  {Array.from({ length: doubleColumnFieldCount }).map(
                    (_, index) => (
                      <div className='w-full' key={index}>
                        <div className='w-full'>
                          <Skeleton
                            width={100}
                            height={12}
                            borderRadius={4}
                            className='inline-block'
                          />
                        </div>
                        <Skeleton
                          width={'100%'}
                          height={40}
                          borderRadius={8}
                          className='inline-block'
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
            {showAboutFiled && (
              <div className='w-full'>
                <div className='w-full'>
                  <Skeleton
                    width={100}
                    height={12}
                    borderRadius={4}
                    className='inline-block'
                  />
                  <Skeleton
                    width={'100%'}
                    height={100}
                    borderRadius={8}
                    className='inline-block'
                  />
                </div>
              </div>
            )}
            {showSocialLinkField && (
              <>
                {Array.from({ length: 1 }).map((_, index) => (
                  <div
                    className='flex items-center justify-start gap-3'
                    key={index}
                  >
                    <div className='flex flex-col items-start justify-start'>
                      <Skeleton
                        width={100}
                        height={12}
                        borderRadius={4}
                        className='inline-block'
                      />
                      <div className='flex items-stretch justify-start w-fit gap-2'>
                        <div className='w-fit flex flex-col items-start justify-start'>
                          <Skeleton
                            width={40}
                            height={40}
                            borderRadius={6}
                            className='inline-block'
                          />
                        </div>
                        <div className='w-fit flex flex-col items-start justify-start'>
                          <Skeleton
                            width={220}
                            height={40}
                            borderRadius={8}
                            className='inline-block'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col items-start justify-start flex-grow'>
                      <Skeleton
                        width={100}
                        height={12}
                        borderRadius={4}
                        className='inline-block'
                      />
                      <div className='flex items-stretch justify-start w-full gap-2'>
                        <div className='w-full'>
                          <Skeleton
                            width={'100%'}
                            height={40}
                            borderRadius={8}
                            className='inline-block'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col items-start justify-start'>
                      <span className='font-inter text-black/65 text-sm px-1 inline-block opacity-0'>
                        Link
                      </span>
                      <div className='flex items-stretch justify-end gap-2'>
                        <Skeleton
                          width={40}
                          height={40}
                          borderRadius={6}
                          className='inline-block'
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Children And Emergency Contact Information Loader  */}

            {childrenEmergencySection && (
              <div className='w-full'>
                <h2 className='font-inter text-base text-black font-medium pt-5 pb-3 border-b border-b-black/30'>
                  <Skeleton width={280} height={24} className='inline-block' />
                </h2>
                <div className='w-full pt-6'>
                  <div className='w-full grid grid-cols-2 gap-5'>
                    {Array.from({ length: doubleColumnFieldCount }).map(
                      (_, index) => (
                        <div className='w-full' key={index}>
                          <div className='w-full'>
                            <Skeleton
                              width={100}
                              height={12}
                              borderRadius={4}
                              className='inline-block'
                            />
                          </div>
                          <Skeleton
                            width={'100%'}
                            height={40}
                            borderRadius={8}
                            className='inline-block'
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}

export default AddEditProfileSkeletonLoader;
