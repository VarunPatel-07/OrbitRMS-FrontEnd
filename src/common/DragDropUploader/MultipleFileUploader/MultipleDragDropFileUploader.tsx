import React, { useCallback, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import { v4 as uuidv4 } from 'uuid';

import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../../Context/Notification/NotificationContextApi';
import { classNames } from '../../../Helper/HelperFunctions';
import { ImageDownscaler } from '../../../Helper/ImageDownscaler';
import { SelectedFileArrayObjInterface } from '../../../interface/interface';
import { MultipleImageUploaderPropsInterface } from '../../../interface/propsInterface';
import MultipleImageCropper from './MultipleImageCropper';

const MultipleDragAndDropFileUploader = React.memo(
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
      isImageCropperActive,
      handelUploadImage,
      asPlusIcon = false,
      disabled,
      remainingImages,
      showError,
      errorMessage,
      maxSize,
    } = props as MultipleImageUploaderPropsInterface;

    const { handelNotification } = useContext(
      NotificationContext
    ) as NotificationContextApiProps;
    const [droppedFilesArray, setDroppedFilesArray] = useState<
      SelectedFileArrayObjInterface[]
    >([]);

    const [imageProcessingLoader, setImageProcessingLoader] =
      useState<boolean>(false);

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
      async (acceptedFiles: Array<File>) => {
        if (acceptedFiles?.length >= 1) {
          setImageProcessingLoader(true);

          try {
            await Promise.all(
              acceptedFiles.map(async (eachFile: File) => {
                if (uploadingFilesTypeCheckingFunction(eachFile)) {
                  if (setIsImageCropperActive) setIsImageCropperActive(true);

                  let processedFile = eachFile;
                  if (eachFile.size > 2 * 1024 * 1024) {
                    try {
                      processedFile = await ImageDownscaler(eachFile, 2); // downscale to ~2MB
                    } catch (err) {
                      console.error('Scaling failed, using original file', err);
                    }
                  }

                  const imgObject: SelectedFileArrayObjInterface = {
                    id: uuidv4(),
                    file: processedFile,
                    croppedImagePreview: '',
                    originalFile: eachFile,
                  };
                  setDroppedFilesArray((pervFile) => [
                    ...(pervFile || []),
                    imgObject,
                  ]);
                } else {
                  const res = {
                    success: false,
                    message: `Oops! That file format isn't supported. Try ${RequiredFileTypeArray?.map((item) => item.split('/')[1]).join(', ')}`,
                  };
                  handelNotification(res, 'top-right');
                }
              })
            );
          } finally {
            setImageProcessingLoader(false);
          }
        }
      },
      [uploadingFilesTypeCheckingFunction]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      maxFiles: remainingImages || 5,
      maxSize: maxSize || 2 * 1024 * 1024,
      onDropRejected: (fileRejections) => {
        setImageProcessingLoader(false);
        if (setIsImageCropperActive) setIsImageCropperActive(false);
        const maxFileSize = maxSize || 2 * 1024 * 1024;

        if (fileRejections?.some((item) => item?.file?.size > maxFileSize)) {
          const res = {
            message: 'File too large! Keep it under 2MB',
            success: false,
          };

          handelNotification(res, 'top-right');
        }

        if (
          remainingImages &&
          !fileRejections?.some((item) => item?.file?.size > maxFileSize)
        ) {
          const res = {
            message: `Max limit! ${remainingImages} image${remainingImages > 1 ? 's' : ''} left.`,

            success: false,
          };
          if (setIsImageCropperActive) setIsImageCropperActive(false);
          handelNotification(res, 'top-right');
        }
        console.log(fileRejections.length);
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
          <input {...getInputProps()} disabled={disabled} />
          {asPlusIcon ? (
            <button
              className={classNames(
                'min-w-[80px] max-w-[80px] max-h-[80px] min-h-[80px] rounded-lg border border-black/20 relative flex items-center justify-center',
                {
                  'opacity-65 cursor-not-allowed': disabled ? true : false,
                }
              )}
            >
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
                  <div
                    className='py-6 px-24  z-10 flex flex-col gap-2 items-center justify-center border border-indigo-500 border-dashed rounded-lg bg-[rgba(99,102,241,0.08)]'
                    style={{
                      border: showError && errorMessage ? '1px solid red' : '',
                    }}
                  >
                    <FaCloudUploadAlt className='w-20 h-20 text-indigo-600' />
                    <p className='text-base text-black'>
                      Drag & Drop Files or <span>Browse</span>
                    </p>
                  </div>
                  {showError && errorMessage && (
                    <span className='text-rose-600  text-xs  mt-1 block px-1.5 font-inter'>
                      {errorMessage}
                    </span>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {isImageCropperActive &&
          createPortal(
            <MultipleImageCropper
              DroppedFilesArray={droppedFilesArray}
              setDroppedFilesArray={setDroppedFilesArray}
              handelImageUploadation={handelImageUploadation}
              cropShape={cropShape}
              maxCropHeight={maxCropHeight}
              maxCropWidth={maxCropWidth}
              setIsImageCropperActive={setIsImageCropperActive}
              imageProcessingLoader={imageProcessingLoader}
            />,
            document.body
          )}
      </>
    );
  }
);
export default MultipleDragAndDropFileUploader;
