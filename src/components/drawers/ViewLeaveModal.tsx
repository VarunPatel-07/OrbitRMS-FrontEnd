import { BiBriefcase, BiCheckCircle, BiHeart } from 'react-icons/bi';
import { FaUserSecret } from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';

import { LeavesTypesInterface } from '@/interface/OrganizationSettings.interface';

import Button from '@/components/common/Button';

import CommonDrawerContainer from '../common/CommonDrawerContainer';

function ViewLeaveModal({
  leaveData,
  showModal,
  handelCancel,
}: {
  leaveData: LeavesTypesInterface;
  showModal: boolean;
  handelCancel: () => void;
}) {
  return (
    <CommonDrawerContainer
      show={showModal}
      onClose={handelCancel}
      direction='RIGHT'
      closeOnOutsideClick
      maxWidth='650px'
      minWidth='550px'
      className='overflow-y-aut h-full hide-scrollbar'
    >
      <div className='w-full h-full mx-auto'>
        <div className='bg-white h-full rounded-lg overflow-hidden shadow-sm'>
          <div className='p-5 border-b border-gray-200 flex items-center justify-between'>
            <h1 className='text-2xl font-semibold text-[#242c40] m-0'>
              {leaveData.leave_name}
            </h1>
            <Button
              type='button'
              onClick={handelCancel}
              className='p-2 hover:bg-gray-200 rounded-lg transition-colors'
            >
              <IoCloseOutline className='text-2xl text-gray-600' />
            </Button>
          </div>
          <div className='w-full h-full max-h-[calc(100vh-80px)] overflow-auto hide-scrollbar'>
            <div className='p-8 border-b border-gray-200'>
              <div className='flex justify-between items-stretch gap-6'>
                <div className='flex flex-col grow items-start justify-between min-w-[300px]'>
                  <div className='flex items-center gap-4 mb-3'>
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
                Reason
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
                    {leaveData?.gender?.length === 0 ? (
                      <span className='px-3 py-1 text-[#242c40]  text-[13px]'>
                        No Data Available
                      </span>
                    ) : (
                      <>
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
                      </>
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
                    {leaveData?.employee_status?.length === 0 ? (
                      <span className='px-3 py-1 text-[#242c40]  text-[13px]'>
                        No Data Available
                      </span>
                    ) : (
                      <>
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
                      </>
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
                    {leaveData?.marital_status?.length === 0 ? (
                      <span className='px-3 py-1 text-[#242c40]  text-[13px]'>
                        No Data Available
                      </span>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommonDrawerContainer>
  );
}

export default ViewLeaveModal;
