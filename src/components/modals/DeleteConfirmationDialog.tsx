import { MdDeleteOutline } from 'react-icons/md';

import { DeleteConfirmationDialogInterface } from '@/interface/ComponentProps.interface';

import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import { classNames } from '@/utils/helpers/commonHelpers';

import DialogModalContainer from '../common/DialogModalContainer';

function DeleteConfirmationDialog({
  showDeleteModal,
  handelOnClose,
  loading,
  handelDelete,
  name,
  ExtraErrorMessage,
  minHeight,
}: DeleteConfirmationDialogInterface) {
  return (
    <DialogModalContainer
      show={showDeleteModal}
      onClose={handelOnClose}
      maxWidth='600px'
      minHeight={`${minHeight || 300}px`}
      className='delete-modal relative overflow-hidden flex flex-col items-start justify-end px-8'
      showDefaultModelHeder={false}
    >
      <>
        <div className='delete absolute -top-[15%]  -left-[10%]'>
          <span className='p-4 flex items-center justify-center overflow-hidden rounded-full border border-red-200'>
            <span className='p-4 flex items-center justify-center overflow-hidden rounded-full border border-red-200'>
              <span className='p-4 flex items-center justify-center overflow-hidden rounded-full border border-red-200'>
                <span className='p-6 flex items-center justify-center overflow-hidden rounded-full border border-red-300'>
                  <MdDeleteOutline className='text-red-400 text-3xl' />
                </span>
              </span>
            </span>
          </span>
        </div>
        <div className='relative z-10 w-full h-full flex flex-col items-start justify-end pb-5 gap-7'>
          <div
            className={classNames('w-full', {
              'flex flex-col items-start justify-start gap-5':
                !!ExtraErrorMessage,
            })}
          >
            <div className='flex flex-col items-start justify-start gap-1'>
              <h4 className='text-[26px] text-slate-950 font-bold font-inter'>
                Delete {name}
              </h4>
              <p className='text-base text-slate-950 font-inter'>
                Are you sure you want to delete {name?.toLocaleLowerCase()}?
                This action is irreversible.
              </p>
            </div>
            {ExtraErrorMessage && ExtraErrorMessage}
          </div>
          <div className='grid grid-cols-2 w-full gap-x-2'>
            <Button
              type='button'
              className='text-[var(--them-green-color)] w-full py-2.5 rounded-lg font-inter border border-[var(--them-green-color)] text-base font-semibold hover:bg-gray-800/5 hover:text-black transition-all'
              onClick={() => handelOnClose()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type='button'
              className='text-white bg-rose-600 hover:bg-rose-700/90 w-full py-2.5 rounded-lg font-inter text-base font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed'
              disabled={loading}
              onClick={handelDelete}
            >
              {loading ? (
                <Loader loaderText='Deleting...' />
              ) : (
                <span>Delete</span>
              )}
            </Button>
          </div>
        </div>
      </>
    </DialogModalContainer>
  );
}

export default DeleteConfirmationDialog;
