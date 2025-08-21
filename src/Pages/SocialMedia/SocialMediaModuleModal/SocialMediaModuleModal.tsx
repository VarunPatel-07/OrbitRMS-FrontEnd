import { useEffect, useRef, useState } from 'react';

import Button from '../../../common/Button';
import SearchInput from '../../../common/Table/SearchInput';
import { GetPlatformLogo } from '../../../constant/SocialMediaConstatnt';
import { classNames } from '../../../Helper/HelperFunctions';
import {
  SocialMediaModuleModalArrayListInterface,
  SocialMediaModuleModalInterface,
} from '../../../interface/SocialMediaModule';
import { SocialMediaModuleModalArrayList } from './SocialMediaModuleModalArrayList';

function SocialMediaModuleModal(props: SocialMediaModuleModalInterface) {
  const { showModal, GlobalStateProvider, setShowModal, selectedAccountArr } =
    props;
  const modalBoxRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(showModal);
  const [isMounted, setIsMounted] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');

  const SocialMediaModuleModalArray =
    SocialMediaModuleModalArrayList(GlobalStateProvider);

  const [data, setData] = useState<SocialMediaModuleModalArrayListInterface[]>(
    SocialMediaModuleModalArray
  );

  const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const val = e.target.value;
    setSearchValue(val);
    if (val.length <= 0) {
      setSearchValue('');
    }
  };

  const handelCancelButton = () => {
    setSearchValue('');
    if (selectedAccountArr?.length == 0) {
      setData(SocialMediaModuleModalArray);
    } else {
      setData(
        SocialMediaModuleModalArray?.filter(
          (item) => !selectedAccountArr?.includes(item?.platform)
        )
      );
    }
  };
  const handelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handelSearchButtonClick();
    }
  };

  const handelSearchButtonClick = () => {
    if (searchValue?.trim().length <= 0) return;

    const filterData = SocialMediaModuleModalArray.filter((item) =>
      item.name?.toLocaleLowerCase().includes(searchValue?.toLocaleLowerCase())
    );
    setData(filterData);
  };

  useEffect(() => {
    if (data?.length == 0 || selectedAccountArr?.length == 0) return;

    setData(
      SocialMediaModuleModalArray?.filter(
        (item) => !selectedAccountArr?.includes(item?.platform)
      )
    );
  }, [selectedAccountArr]);

  useEffect(() => {
    if (showModal) {
      setIsMounted(true);
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    } else {
      setIsVisible(false);
      setTimeout(() => {
        setIsMounted(false);
      }, 300);
    }
  }, [showModal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalBoxRef.current &&
        !modalBoxRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowModal, showModal]);

  if (!isMounted) return null;
  if (isVisible)
    return (
      <div
        className={classNames(
          'w-full h-screen bg-black/30 fixed z-50 top-0 left-0 overflow-hidden transition-all duration-100',
          {
            'opacity-0 invisible': !isVisible,
            'opacity-100 visible': isVisible,
          }
        )}
      >
        <div className='w-full h-full p-4 flex items-center justify-center overflow-hidden'>
          <div
            className={classNames(
              'bg-white w-fit h-fit max-w-[530px] min-w-[530px] hide-scrollbar rounded-lg transition-all p-4',
              {
                'opacity-0 scale-50': !isVisible,
                'opacity-100 scale-100': isVisible,
              }
            )}
            ref={modalBoxRef}
          >
            <div className='w-full h-full flex flex-col items-start justify-start gap-5'>
              <div className='w-full flex flex-col items-start justify-start gap-1'>
                <h2 className='text-black font-inter text-lg font-semibold'>
                  Select Your Preferred Account
                </h2>
                <p className='text-black/80 font-inter text-sm font-normal'>
                  Use the search bar to find your desired social account, then
                  click on the <strong>"Connect Account"</strong> button to link
                  it.
                </p>
              </div>
              <div className='w-full'>
                <SearchInput
                  value={searchValue}
                  handelOnChange={handelOnChange}
                  handelCancelButton={handelCancelButton}
                  handelKeyDown={handelKeyDown}
                />
              </div>
              <div className='flex items-start justify-between flex-wrap gap-4 w-full max-h-[425px] overflow-auto hide-scrollbar'>
                {data?.map((data, index) => (
                  <div
                    key={index}
                    className='min-w-60 min-h-60 max-w-60 max-h-60 border border-black/20 rounded-lg flex flex-col items-center justify-center p-3 relative'
                  >
                    <div className='w-full m-auto pt-12'>
                      <div className='min-w-[60px] m-auto min-h-[60px] max-w-[60px] max-h-[60px]'>
                        <img
                          src={GetPlatformLogo[data?.platform]}
                          alt='Facebook'
                          width={60}
                          height={60}
                          loading='lazy'
                        />
                      </div>
                    </div>
                    <div className='flex flex-col items-center justify-end gap-6 flex-grow w-full'>
                      <div className='w-full flex flex-col items-center justify-center gap-2'>
                        <p className='text-black text-base font-inter font-medium'>
                          {data?.name}
                        </p>
                      </div>
                      <div className='flex flex-col items-start justify-center gap-1 w-full'>
                        <Button
                          type='button'
                          className='bg-[var(--them-green-light-color)] text-white w-full rounded-md text-sm font-inter font-medium capitalize py-1.5 px-2'
                          onClick={data?.onClickFunction}
                        >
                          Connect Account
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {data?.length == 0 && (
                  <div className='w-full h-full min-h-[420px] flex items-center justify-center'>
                    <p className='text-black text-base'>
                      No results found. Try refining your search.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default SocialMediaModuleModal;
