import { MdErrorOutline } from 'react-icons/md';

import { ErrorDialogInterface } from '@/interface/ComponentProps.interface';

import Button from '@/components/common/Button';
import { classNames } from '@/utils/helpers/commonHelpers';

import DialogModalContainer from '../common/DialogModalContainer';

function ErrorDialog({
  showErrorModal,
  setShowErrorModal,
  title,
  message,
  errorDetails,
  minHeight,
  onClose,
}: ErrorDialogInterface) {
  const handleClose = () => {
    if (setShowErrorModal) setShowErrorModal(false);
    onClose?.();
  };

  return (
    <DialogModalContainer
      show={showErrorModal}
      onClose={handleClose}
      className='delete-modal min-w-[400px] px-8 relative overflow-hidden flex flex-col items-start justify-end'
      maxWidth='700px'
      minHeight={`${minHeight || 300}px`}
      showDefaultModelHeder={false}
    >
      <div className='error-icon absolute -top-[15%] -left-[10%]'>
        <span className='p-4 flex items-center justify-center overflow-hidden rounded-full border border-red-200'>
          <span className='p-4 flex items-center justify-center overflow-hidden rounded-full border border-red-200'>
            <span className='p-4 flex items-center justify-center overflow-hidden rounded-full border border-red-200'>
              <span className='p-6 flex items-center justify-center overflow-hidden rounded-full border border-red-300'>
                <MdErrorOutline className='text-red-400 text-3xl' />
              </span>
            </span>
          </span>
        </span>
      </div>
      <div className='relative z-10 w-full h-full flex flex-col items-start justify-end pb-5 gap-7'>
        <div
          className={classNames('w-full', {
            'flex flex-col items-start justify-start gap-5': !!errorDetails,
          })}
        >
          <div className='flex flex-col items-start justify-start gap-1'>
            <h4 className='text-[26px] text-slate-950 font-bold font-inter'>
              {title || 'Error'}
            </h4>
            <p className='text-base text-slate-950 font-inter'>
              {message || 'An error occurred. Please try again.'}
            </p>
          </div>
          {errorDetails && (
            <div className='text-sm text-slate-700 font-inter'>
              {typeof errorDetails === 'string' ? (
                <p>{errorDetails}</p>
              ) : (
                errorDetails
              )}
            </div>
          )}
        </div>
        <div className='w-full pt-4'>
          <Button
            type='button'
            className='bg-transparent hover:bg-gray-200 border border-black text-black w-full py-2.5 rounded-lg font-inter text-base font-semibold transition-all'
            onClick={handleClose}
          >
            Close
          </Button>
        </div>
      </div>
    </DialogModalContainer>
  );
}

export default ErrorDialog;
