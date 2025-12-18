import { useEffect, useRef, useState } from 'react';

import { BiBriefcase, BiCheckCircle, BiHeart } from 'react-icons/bi';
import { FaUserSecret } from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';

import { classNames } from '../../../../Helper/HelperFunctions';
import { LeavesTypesInterface } from '../../../../interface/OrganizationSettings';

function ViewLeaveModal({
  leaveData,
  showModal,
  handelCancel,
}: {
  leaveData: LeavesTypesInterface | null;
  showModal: boolean;
  handelCancel: () => void;
}) {
  const [isVisible, setIsVisible] = useState(showModal && leaveData !== null);
  const [isMounted, setIsMounted] = useState(false);
  const modalBoxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalBoxRef.current &&
        !modalBoxRef.current.contains(event.target as Node)
      ) {
        handelCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModal]);

  useEffect(() => {
    if (showModal && leaveData !== null) {
      setIsMounted(true);
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    } else {
      setIsVisible(false);
      setTimeout(() => {
        setIsMounted(false);
      }, 500);
    }
  }, [showModal, leaveData]);
  if (!isMounted) return null;

  if (showModal && leaveData !== null)
    return (
      <div
        className={classNames(
          'fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm transition-all duration-100',
          {
            'opacity-0 invisible pointer-events-none': !isVisible,
            'opacity-100 visible pointer-events-auto': isVisible,
          }
        )}
      >
        <div
          className={classNames(
            'w-full max-w-[650px] h-full bg-white shadow-lg overflow-y-auto animate-slide-in-right transition-all duration-300 hide-scrollbar',
            {
              'opacity-0 invisible pointer-events-none translate-x-1/2':
                !isVisible,
              'opacity-100 visible pointer-events-auto translate-x-0':
                isVisible,
            }
          )}
          ref={modalBoxRef}
        >
          <div className='w-full mx-auto'>
            <div className='bg-white rounded-lg overflow-hidden shadow-sm'>
              <div className='p-8 border-b border-gray-200'>
                <div className='flex justify-between items-stretch gap-6'>
                  <div className='flex flex-col grow items-start justify-between min-w-[300px]'>
                    <div className='flex items-center gap-4 mb-3'>
                      <h1 className='text-2xl font-semibold text-[#242c40] m-0'>
                        {leaveData.leave_name}
                      </h1>
                      <span className='text-base font-bold text-green-700 px-2 py-1.5 bg-[#f0f7f4] rounded-md tracking-wide'>
                        {leaveData.leave_code}
                      </span>
                    </div>
                    <div className='flex gap-3  flex-wrap'>
                      {leaveData.is_paid && (
                        <span className='inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-green-700 text-white rounded text-base font-semibold'>
                          <BiCheckCircle size={20} /> Paid Leave
                        </span>
                      )}
                      {leaveData.status && (
                        <span className='px-3.5 py-1.5 bg-green-100 text-green-700 rounded text-base font-semibold border border-green-300'>
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='text-center p-5 bg-[#242c40] rounded-lg min-w-[140px]'>
                    <div className='text-[48px] font-bold text-white leading-none'>
                      {leaveData.max_number_of_leave}
                    </div>
                    <div className='text-[13px] text-gray-100 mt-2 font-medium'>
                      Days Available
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-full px-8 pt-8'>
                {leaveData.refill_quarterly && (
                  <div className='rounded-lg p-6 border bg-[#f9f9f9] border-[#e5e5e5]'>
                    <div className='flex items-center gap-4'>
                      <div className='rounded-lg p-3 bg-green-100'>
                        <FiRefreshCw
                          className='w-5 h-5'
                          style={{ color: '#242c40' }}
                        />
                      </div>
                      <div>
                        <h3
                          className='font-semibold text-base mb-1'
                          style={{ color: '#242c40' }}
                        >
                          Quarterly Refill Schedule
                        </h3>
                        <p className='text-sm' style={{ color: '#666' }}>
                          Refills from {leaveData.refill_from}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className='px-8 pt-8'>
                <h2 className='text-[16px] font-semibold text-[#242c40] mb-2 mt-0'>
                  Description
                </h2>

                <p className='text-gray-600 w-full'>{leaveData?.description}</p>
              </div>
              <div className='p-8'>
                <h2 className='text-[16px] font-semibold text-[#242c40] mb-5 mt-0'>
                  Eligibility Criteria
                </h2>

                <div className='grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5'>
                  <div className='p-5 bg-[#f8f9fa] rounded-md border border-gray-200'>
                    <div className='flex items-center gap-2 mb-3'>
                      <FaUserSecret size={18} color='#242c40' />
                      <h3 className='text-[14px] font-semibold text-[#242c40] m-0'>
                        Gender
                      </h3>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {JSON.parse(leaveData.gender)?.map(
                        (g: string, idx: number) => (
                          <span
                            key={idx}
                            className='px-3 py-1 bg-white text-[#242c40] rounded text-[13px] border border-gray-300'
                          >
                            {g}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div className='p-5 bg-[#f8f9fa] rounded-md border border-gray-200'>
                    <div className='flex items-center gap-2 mb-3'>
                      <BiBriefcase size={18} color='#242c40' />
                      <h3 className='text-[14px] font-semibold text-[#242c40] m-0'>
                        Employment Status
                      </h3>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {JSON.parse(leaveData.employee_status)?.map(
                        (status: string, idx: number) => (
                          <span
                            key={idx}
                            className='px-3 py-1 bg-white text-[#242c40] rounded text-[13px] border border-gray-300'
                          >
                            {status}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div className='p-5 bg-[#f8f9fa] rounded-md border border-gray-200'>
                    <div className='flex items-center gap-2 mb-3'>
                      <BiHeart size={18} color='#242c40' />
                      <h3 className='text-[14px] font-semibold text-[#242c40] m-0'>
                        Marital Status
                      </h3>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {JSON.parse(leaveData.marital_status)?.map(
                        (status: string, idx: number) => (
                          <span
                            key={idx}
                            className='px-3 py-1 bg-white text-[#242c40] rounded text-[13px] border border-gray-300'
                          >
                            {status}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default ViewLeaveModal;
