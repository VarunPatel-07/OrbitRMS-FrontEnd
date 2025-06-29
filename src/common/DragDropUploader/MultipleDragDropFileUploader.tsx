import React, { useCallback, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../Context/Notification/NotificationContextApi';
import { SelectedFileArrayObjInterface } from '../../interface/interface';
// import { endpointObject, multiplePostApi } from '../../Helper/api/multipleAPI';

import { DragDropUploaderProps } from '../../interface/propsInterface';

const MultipleImageCropper = React.lazy(() => import('./MultipleImageCropper'));

function MultipleDragAndDropFileUploader(props: DragDropUploaderProps) {
  const {
    RequiredFileTypeArray,
    showDropFileScreenInFullScreen,
    cropShape,
    maxCropHeight,
    maxCropWidth,
    // setImageUrl,
  } = props as DragDropUploaderProps;

  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;
  const [selectedFileArrayObj, setSelectedFileArrayObj] = useState<
    SelectedFileArrayObjInterface[]
  >([]);
  // const [loading, setLoading] = useState<boolean>(false);

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
          };
          setSelectedFileArrayObj((pervFile) => [
            ...(pervFile || []),
            imgObject,
          ]);
        } else {
          const res = {
            success: false,
            message: `The Formate Is Not Allowed`,
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
    onDropRejected: (fileRejections) => {
      if (fileRejections.length > 6) {
        const res = {
          message:
            'Upload limit exceeded: A maximum of 5 files/images are allowed.',
          success: false,
        };

        handelNotification(res, 'top-right');
      }
    },
  });

  const handelImageUploadation = async (
    fieData: SelectedFileArrayObjInterface[]
  ) => {
    if (!fieData) return;
    // setLoading(true);
    console.log(fieData);
  };

  return (
    <>
      <div {...getRootProps()} className='cursor-pointer'>
        <input {...getInputProps()} />
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
      </div>

      {selectedFileArrayObj?.length !== 0 &&
        createPortal(
          <MultipleImageCropper
            DroppedFilesArray={selectedFileArrayObj}
            setDroppedFilesArray={setSelectedFileArrayObj}
            handelImageUploadation={handelImageUploadation}
            cropShape={cropShape}
            maxCropHeight={maxCropHeight}
            maxCropWidth={maxCropWidth}
          />,
          document.body
        )}
    </>
  );
}

export default MultipleDragAndDropFileUploader;
