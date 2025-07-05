import { useCallback, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import { v4 as uuidv4 } from 'uuid';

import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../../Context/Notification/NotificationContextApi';
import { SelectedFileArrayObjInterface } from '../../../interface/interface';
import { MultipleImageUploaderPropsInterface } from '../../../interface/propsInterface';
import MultipleImageCropper from './MultipleImageCropper';

function MultipleDragAndDropFileUploader(
  props: MultipleImageUploaderPropsInterface
) {
  const {
    RequiredFileTypeArray,
    showDropFileScreenInFullScreen,
    cropShape,
    maxCropHeight,
    maxCropWidth,
    setIsImageCropperActive,
    handelUploadImage,
    asPlusIcon = false,
  } = props as MultipleImageUploaderPropsInterface;

  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;
  const [droppedFilesArray, setDroppedFilesArray] = useState<
    SelectedFileArrayObjInterface[]
  >([]);

  const uploadingFilesTypeCheckingFunction = useCallback(
    (file: File) => {
      if (RequiredFileTypeArray?.includes(file.type)) {
        return true;
      } else {
        return false;
      }
    },
    [RequiredFileTypeArray]
  );
  const onDrop = useCallback(
    (acceptedFiles: Array<File>) => {
      acceptedFiles.map((eachFile: File) => {
        if (uploadingFilesTypeCheckingFunction(eachFile)) {
          const imgObject: SelectedFileArrayObjInterface = {
            id: uuidv4(),
            file: eachFile,
            croppedImagePreview: '',
          };
          setDroppedFilesArray((pervFile) => [...(pervFile || []), imgObject]);
          if (setIsImageCropperActive) setIsImageCropperActive(true);
        } else {
          const res = {
            success: false,
            message: `Oops! That file format isn't supported. Try ${RequiredFileTypeArray?.map((item) => item.split('/')[1]).join(', ')}`,
          };
          handelNotification(res, 'top-right');
        }
      });
    },
    [uploadingFilesTypeCheckingFunction]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 5,
    maxSize: 3 * 1024 * 1024,
    onDropRejected: (fileRejections) => {
      if (fileRejections?.some((item) => item?.file?.size > 3 * 1024 * 1024)) {
        const res = {
          message: 'File too large! Keep it under 2MB',
          success: false,
        };

        handelNotification(res, 'top-right');
      }
      if (fileRejections.length > 6) {
        const res = {
          message: 'Too many files! Max 5 at a time',
          success: false,
        };
        if (setIsImageCropperActive) setIsImageCropperActive(false);
        handelNotification(res, 'top-right');
      }
    },
  });

  const handelImageUploadation = async (
    fieData: SelectedFileArrayObjInterface[]
  ) => {
    if (!fieData) return;
    if (setIsImageCropperActive) setIsImageCropperActive(false);
    setDroppedFilesArray([]);
    handelUploadImage(fieData);
  };

  return (
    <>
      <div {...getRootProps()} className='cursor-pointer'>
        <input {...getInputProps()} />
        {asPlusIcon ? (
          <button className='min-w-[80px] max-w-[80px] max-h-[80px] min-h-[80px] rounded-lg border border-black/20 relative flex items-center justify-center'>
            <FaPlus className='w-7 h-7 text-black' />
          </button>
        ) : (
          <>
            {isDragActive ? (
              showDropFileScreenInFullScreen ? (
                createPortal(
                  <div className='fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-sm z-50 flex items-center justify-center'>
                    <h6 className='text-5xl font-sans font-semibold'>
                      Drop the files here ...
                    </h6>
                  </div>,
                  document.body
                )
              ) : (
                <>
                  <div className='py-6 px-24  z-10 flex flex-col gap-2 items-center justify-center border border-indigo-500 border-dashed rounded-lg bg-[rgba(99,102,241,0.08)]'>
                    <FaCloudUploadAlt className='w-20 h-20 text-indigo-600' />
                    <p className='text-base font-semibold text-indigo-700'>
                      Drop Files to Upload
                    </p>
                  </div>
                </>
              )
            ) : (
              <>
                <div className='py-6 px-24  z-10 flex flex-col gap-2 items-center justify-center border border-indigo-500 border-dashed rounded-lg bg-[rgba(99,102,241,0.08)]'>
                  <FaCloudUploadAlt className='w-20 h-20 text-indigo-600' />
                  <p className='text-base text-black'>
                    Drag & Drop Files or <span>Browse</span>
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {droppedFilesArray?.length !== 0 &&
        createPortal(
          <MultipleImageCropper
            DroppedFilesArray={droppedFilesArray}
            setDroppedFilesArray={setDroppedFilesArray}
            handelImageUploadation={handelImageUploadation}
            cropShape={cropShape}
            maxCropHeight={maxCropHeight}
            maxCropWidth={maxCropWidth}
            setIsImageCropperActive={setIsImageCropperActive}
          />,
          document.body
        )}
    </>
  );
}

export default MultipleDragAndDropFileUploader;
