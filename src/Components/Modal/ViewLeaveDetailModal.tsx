import { useEffect, useState } from 'react';

import { FaRegFileLines } from 'react-icons/fa6';
import { HiOutlineEye } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';

import Button from '../../common/Button';
import { LEAVE_STATUS_CONFIG } from '../../constant/constant';
import {
  FormateLeaveHalf,
  LeaveInfoRow,
  LeaveSectionTitle,
} from '../../Helper/Helper';
import {
  classNames,
  formateDate,
  formatIsoDate,
} from '../../Helper/HelperFunctions';
import {
  LeaveUploadedDocumentObject,
  ViewLeaveDataModalInterface,
} from '../../interface/LeavesModule';
import EmployeeProfilePicture from '../EmployeeProfilePicture';

function ViewLeaveDetailModal({
  leaveDetails,
  defaultDateFormate,
  showModal,
  updateLeaveLoader,
  toggleViewLeaveDetails,
  updateTheLeaveRequest,
}: ViewLeaveDataModalInterface) {
  const [isVisible, setIsVisible] = useState<boolean>(showModal);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const status =
    LEAVE_STATUS_CONFIG[
      leaveDetails.status as keyof typeof LEAVE_STATUS_CONFIG
    ] || LEAVE_STATUS_CONFIG.pending;

  const createdBy = leaveDetails?.created_by
    ? JSON.parse(leaveDetails.created_by)
    : null;
  const updatedBy = leaveDetails?.updated_by
    ? JSON.parse(leaveDetails.updated_by)
    : null;

  const reporting_manager = leaveDetails.reporting_manager;

  const downloadFileWithName = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url, { mode: 'cors' });
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = blobUrl;
      link.download = fileName; // ✅ force filename
      document.body.appendChild(link);
      link.click();

      // cleanup
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

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

  if (!isMounted) return null;

  return (
    <div
      className={classNames(
        'w-full h-screen fixed z-50 top-0 left-0 overflow-hidden transition-all duration-500 flex justify-end',
        {
          'opacity-0 invisible': !isVisible,
          'opacity-100 visible': isVisible,
        }
      )}
    >
      <div
        onClick={() => toggleViewLeaveDetails()}
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      <div
        className={`h-full w-full max-w-lg bg-white overflow-hidden  transition-all duration-1000 relative z-50  ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className='w-full h-full flex flex-col'>
          <div className='flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white  z-10'>
            <div className='flex items-center gap-2'>
              <span className='text-base font-bold text-black capitalize'>
                Leave Details
              </span>
            </div>
            <Button
              type='button'
              onClick={() => toggleViewLeaveDetails()}
              className='p-1.5 rounded-lg text-black border border-gray-300  hover:bg-gray-300 transition-colors'
            >
              <IoClose />
            </Button>
          </div>

          <div
            className={`flex-1 overflow-y-auto pb-6 overflow-auto hide-scrollbar`}
          >
            <div className='bg-gradient-to-br from-indigo-600 to-indigo-800 px-5 pt-5 pb-6 relative overflow-hidden'>
              <div className='absolute -top-6 -right-6 w-32 h-32 bg-white/5 rounded-full' />
              <div className='absolute top-10 -right-2 w-16 h-16 bg-white/5 rounded-full' />

              <div className='flex items-center justify-between pb-2'>
                <p className='text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-3'>
                  Applied By
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${status.bg} ${status.text} ${status.border}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full capitalize ${status.dot}`}
                  />
                  {leaveDetails.status}
                </span>
              </div>

              {'employee_info' in leaveDetails && (
                <div className='flex items-center gap-4'>
                  <div className='relative'>
                    <EmployeeProfilePicture
                      width={70}
                      height={70}
                      profilePicture={
                        leaveDetails?.employee_info?.profile_picture
                      }
                    />
                  </div>
                  <div>
                    <h2 className='text-white text-lg font-bold leading-tight'>
                      {leaveDetails?.employee_info?.full_name}
                    </h2>
                  </div>
                </div>
              )}

              {/* Duration Strip */}
              <div className='mt-4 bg-white/10 rounded-xl p-3 flex items-center justify-between'>
                <div>
                  <p className='text-indigo-300 text-xs mb-0.5'>
                    Total Duration
                  </p>
                  <p className='text-white text-xl font-bold'>
                    {leaveDetails.total_days}{' '}
                    <span className='text-sm font-normal text-indigo-200'>
                      days
                    </span>
                  </p>
                </div>
                <div className='flex items-center gap-3 text-right'>
                  <div>
                    <p className='text-indigo-300 text-xs mb-0.5'>From</p>
                    <p className='text-white text-sm font-semibold'>
                      {formatIsoDate(
                        leaveDetails.start_date,
                        defaultDateFormate
                      )}
                    </p>
                    <p className='text-indigo-300 text-xs'>
                      {FormateLeaveHalf(leaveDetails.start_half)}
                    </p>
                  </div>
                  <div className='flex flex-col items-center gap-1'>
                    <div className='w-px h-3 bg-indigo-400' />
                    <div className='w-1.5 h-1.5 rounded-full bg-indigo-300' />
                    <div className='w-px h-3 bg-indigo-400' />
                  </div>
                  <div>
                    <p className='text-indigo-300 text-xs mb-0.5'>To</p>
                    <p className='text-white text-sm font-semibold'>
                      {formatIsoDate(
                        leaveDetails?.end_date,
                        defaultDateFormate
                      )}
                    </p>
                    <p className='text-indigo-300 text-xs'>
                      {FormateLeaveHalf(leaveDetails.end_half)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='px-5'>
              <div className='mt-4 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3'>
                <p className='text-xs text-indigo-400 font-semibold uppercase tracking-wide mb-0.5'>
                  Leave Type
                </p>
                <p className='text-indigo-900 font-bold text-sm'>
                  {leaveDetails.leave_name} -
                  <span className='text-xs font-bold text-indigo-500 tracking-widest uppercase'>
                    ({leaveDetails.leave_code})
                  </span>
                </p>
              </div>

              <LeaveSectionTitle>Reporting Manager</LeaveSectionTitle>
              <div className='bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center gap-4'>
                <EmployeeProfilePicture
                  width={30}
                  height={30}
                  profilePicture={reporting_manager?.profile_picture}
                />
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-bold text-gray-900 truncate'>
                    {reporting_manager.full_name}
                  </p>
                </div>
              </div>

              <LeaveSectionTitle>Leave Details</LeaveSectionTitle>
              <div className='bg-gray-50 rounded-xl px-4 py-1 border border-gray-100'>
                <LeaveInfoRow
                  label='Start Date'
                  value={`${formatIsoDate(leaveDetails.start_date, defaultDateFormate)} · ${FormateLeaveHalf(leaveDetails.start_half)}`}
                />
                <LeaveInfoRow
                  label='End Date'
                  value={`${formatIsoDate(leaveDetails.end_date, defaultDateFormate)} · ${FormateLeaveHalf(leaveDetails?.end_half)}`}
                />
                <LeaveInfoRow
                  label='Total Days'
                  value={`${leaveDetails.total_days} days`}
                />
                <LeaveInfoRow
                  label='Is Planned'
                  value={leaveDetails.is_planned ? 'Yes' : 'No'}
                />
                <LeaveInfoRow
                  label='Notify To'
                  value={leaveDetails.notify_to_id ?? 'Not specified'}
                />
              </div>

              {leaveDetails.description && (
                <>
                  <LeaveSectionTitle>Reason</LeaveSectionTitle>
                  <div className='bg-gray-50 rounded-xl p-4 border border-gray-100'>
                    <p className='text-sm text-gray-700 leading-relaxed'>
                      {leaveDetails.description}
                    </p>
                  </div>
                </>
              )}

              <LeaveSectionTitle>Documents</LeaveSectionTitle>
              {leaveDetails?.documents === '[]' ? (
                <div className='bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 flex items-center gap-3 group hover:border-green-200 hover:bg-green-50/40 transition-all duration-150'>
                  <div className='w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:border-green-200 transition-colors duration-150'>
                    <FaRegFileLines className='text-green-500 text-sm' />
                  </div>

                  <p className='text-sm text-gray-400 font-medium flex-1 truncate'>
                    No Document Uploaded
                  </p>
                </div>
              ) : (
                <>
                  {JSON.parse(leaveDetails.documents)?.map(
                    (doc: LeaveUploadedDocumentObject, index: number) => (
                      <div
                        key={index}
                        className='bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 flex items-center gap-3 group hover:border-green-200 hover:bg-green-50/40 transition-all duration-150'
                      >
                        <div className='w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:border-green-200 transition-colors duration-150'>
                          <FaRegFileLines className='text-green-500 text-sm' />
                        </div>

                        <p className='text-sm text-gray-700 font-medium flex-1 truncate'>
                          {doc?.file_name}
                        </p>

                        {doc?.file_type
                          ?.toLocaleLowerCase()
                          ?.includes('pdf') ? (
                          <a
                            href={doc.media_asset_url}
                            target={'_blank'}
                            rel='noopener noreferrer'
                            title='Open document'
                            className='w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-100 transition-all duration-150 flex-shrink-0'
                          >
                            <HiOutlineEye className='text-[1.1rem]' />
                          </a>
                        ) : (
                          <button
                            onClick={() =>
                              downloadFileWithName(
                                doc?.original_url,
                                doc?.file_name || 'document'
                              )
                            }
                            title='Download document'
                            className='w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-100 transition-all duration-150 flex-shrink-0'
                          >
                            <HiOutlineEye className='text-[1.1rem]' />
                          </button>
                        )}
                      </div>
                    )
                  )}
                </>
              )}

              <LeaveSectionTitle>Audit Info</LeaveSectionTitle>
              <div className='bg-gray-50 rounded-xl px-4 py-1 border border-gray-100'>
                <LeaveInfoRow
                  label='Created At'
                  value={formateDate(
                    leaveDetails.created_at,
                    defaultDateFormate
                  )}
                />
                <LeaveInfoRow
                  label='Updated At'
                  value={
                    leaveDetails.updated_at
                      ? formateDate(leaveDetails.updated_at, defaultDateFormate)
                      : 'Not updated'
                  }
                />
                <LeaveInfoRow
                  label='Created By'
                  value={
                    createdBy
                      ? `${createdBy?.first_name} ${createdBy?.last_name}`
                      : '-'
                  }
                />
                <LeaveInfoRow
                  label='Updated By'
                  value={
                    updatedBy
                      ? `${updatedBy?.first_name} ${updatedBy?.last_name}`
                      : '-'
                  }
                />
              </div>
            </div>
          </div>
          {updateTheLeaveRequest && (
            <>
              {leaveDetails.status !== 'cancelled' && (
                <div className='px-5 py-4 border-t border-gray-100 bg-white flex gap-3'>
                  {leaveDetails.status !== 'approved' &&
                    leaveDetails.status !== 'rejected' && (
                      <Button
                        type='button'
                        className='flex-1 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-600 text-sm font-semibold py-2.5 rounded-xl border border-emerald-200 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-200'
                        onClick={() =>
                          updateTheLeaveRequest(leaveDetails.id, 'approved')
                        }
                        disabled={
                          !!updateLeaveLoader ||
                          leaveDetails.status === 'rejected' ||
                          leaveDetails.status === 'cancelled'
                        }
                        loader={updateLeaveLoader === 'approved'}
                        loaderText='Approving...'
                      >
                        Approve
                      </Button>
                    )}

                  {leaveDetails.status !== 'approved' &&
                    leaveDetails.status !== 'rejected' && (
                      <Button
                        type='button'
                        className='flex-1 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 text-sm font-semibold py-2.5 rounded-xl border border-red-200 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-200'
                        onClick={() =>
                          updateTheLeaveRequest(leaveDetails.id, 'rejected')
                        }
                        disabled={
                          !!updateLeaveLoader ||
                          leaveDetails.status === 'approved' ||
                          leaveDetails.status === 'cancelled'
                        }
                        loader={updateLeaveLoader === 'rejected'}
                        loaderText='Rejecting...'
                      >
                        Reject
                      </Button>
                    )}
                  {leaveDetails.status !== 'rejected' && (
                    <Button
                      type='button'
                      className='flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-150 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-300'
                      onClick={() =>
                        updateTheLeaveRequest(leaveDetails.id, 'cancelled')
                      }
                      disabled={
                        !!updateLeaveLoader ||
                        leaveDetails.status === 'cancelled'
                      }
                      loader={updateLeaveLoader === 'cancelled'}
                      loaderText='Canceling...'
                    >
                      Cancel Request
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewLeaveDetailModal;
