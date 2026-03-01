import { useCallback, useContext, useState } from 'react';

import { createPortal } from 'react-dom';
import { useDropzone } from 'react-dropzone';
import { Area } from 'react-easy-crop';
import { FaCloudUploadAlt } from 'react-icons/fa';

import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../../Context/Notification/NotificationContextApi';
import {
  endpointObject,
  multiplePostApi,
} from '../../../Helper/api/multipleAPI';
import {
  createImageUtilFunction,
  dataUrlToFileConvertor,
  getBoundingBox,
  getRadianAngle,
} from '../../../Helper/HelperFunctions';
import { useDebounce } from '../../../Hooks/useDebounce';
import { DragDropUploaderProps } from '../../../interface/propsInterface';
import ImageCropper from './ImageCropper';

function DragAndDropFileUploader(props: DragDropUploaderProps) {
  const {
    RequiredFileTypeArray,
    showDropFileScreenInFullScreen,
    maxCropHeight,
    maxCropWidth,
    setImageUrl,
    disabled,
    cropShape = 'round',
    enableCropping = true,
  } = props as DragDropUploaderProps;

  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [croppedImagePreview, setCroppedImagePreview] = useState<string>('');

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
      acceptedFiles.forEach((eachFile: File) => {
        if (!uploadingFilesTypeCheckingFunction(eachFile)) {
          handelNotification(
            { success: false, message: 'The Format Is Not Allowed' },
            'top-right'
          );
          return;
        }

        if (enableCropping) {
          setSelectedFile(eachFile);
        } else {
          const imageUrl = URL.createObjectURL(eachFile);
          handelImageUploadation(imageUrl);
        }
      });
    },
    [uploadingFilesTypeCheckingFunction, enableCropping]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 2 * 1024 * 1024,
    onDropRejected: (fileRejections) => {
      const isLarge = fileRejections?.some(
        (item) => item?.file?.size > 3 * 1024 * 1024
      );
      if (isLarge) {
        const res = {
          message: 'File too large! Keep it under 2MB',
          success: false,
        };
        handelNotification(res, 'top-right');
      }
      if (fileRejections.length > 0 && !isLarge) {
        const res = {
          message: 'Too many files! Max 5 at a time',
          success: false,
        };
        handelNotification(res, 'top-right');
      }
    },
  });

  const onCropDone = (croppedArea: Area, rotation: number) => {
    setLoading(true);
    handelCropDoneDebounce(croppedArea, rotation);
  };

  const onCropCancel = () => {
    setLoading(false);
    setCroppedImagePreview('');
    setSelectedFile(null);
  };

  const handelCropDoneDebounce = useDebounce(
    async (croppedArea: Area, rotation: number) => {
      if (!selectedFile) return;

      const imageUrl = URL.createObjectURL(selectedFile);
      const imageObject = await createImageUtilFunction(imageUrl);
      URL.revokeObjectURL(imageUrl);

      const canvasElement = document.createElement('canvas');
      const canvasContext = canvasElement.getContext('2d');

      if (!canvasContext) return;

      const rotatedRadius = getRadianAngle(rotation);
      const { width: imgWidth, height: imgHeight } = imageObject;

      // Get bounding box size to fit rotated image
      const { width: boundingBoxWidth, height: boundingBoxHeight } =
        getBoundingBox(imgWidth, imgHeight, rotatedRadius);

      // Set canvas size to fit the rotated image
      canvasElement.width = boundingBoxWidth;
      canvasElement.height = boundingBoxHeight;

      // Translate & Rotate
      canvasContext.translate(boundingBoxWidth / 2, boundingBoxHeight / 2);
      canvasContext.rotate(rotatedRadius);
      canvasContext.translate(-imgWidth / 2, -imgHeight / 2);

      // Draw the rotated image
      canvasContext.drawImage(imageObject, 0, 0);

      // Create a new canvas for cropping
      const croppedImageCanvas = document.createElement('canvas');
      const croppedImageContext = croppedImageCanvas.getContext('2d');

      if (!croppedImageContext) return;

      croppedImageCanvas.width = croppedArea.width;
      croppedImageCanvas.height = croppedArea.height;

      // Draw cropped section
      croppedImageContext.drawImage(
        canvasElement,
        croppedArea.x,
        croppedArea.y,
        croppedArea.width,
        croppedArea.height,
        0,
        0,
        croppedArea.width,
        croppedArea.height
      );

      const dataUrl = croppedImageCanvas.toDataURL('image/jpeg');

      setLoading(false);
      setCroppedImagePreview(dataUrl);
    },
    100
  );

  const uploadImageToCloudWithDebounce = useDebounce(
    async (imageUrl: string) => {
      const file = dataUrlToFileConvertor(
        imageUrl,
        'organization-profile-picture.png'
      );

      const multipartHeader = {
        'Content-Type': 'multipart/form-data',
      };

      const formData = new FormData();
      formData.append('file', file);

      const endpointArray: Array<endpointObject> = [
        {
          endPoint: 'upload/single-upload',
          data: formData,
          protected: true,
          header: multipartHeader,
        },
      ];

      const response = await multiplePostApi(endpointArray);
      const res = response[0];
      if (!res?.success) {
        const successData = {
          success: false,
          message: 'Unable To Upload Image Try Again Letter',
        };
        handelNotification(successData, 'top-right');

        setLoading(false);
        setSelectedFile(null);
        setCroppedImagePreview('');
        return;
      }
      setImageUrl(res?.data?.url);

      const successData = {
        success: true,
        message: 'Image Uploaded Successfully',
      };
      handelNotification(successData, 'top-right');

      setLoading(false);
      setSelectedFile(null);
      setCroppedImagePreview('');
      // we will do something here
    },
    100
  );

  const handelImageUploadation = async (imageUrl: string) => {
    if (!imageUrl) return;
    setLoading(true);
    uploadImageToCloudWithDebounce(imageUrl);
  };

  return (
    <>
      <div {...getRootProps()} className='cursor-pointer'>
        <input {...getInputProps()} disabled={disabled} />
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
              <div
                className={`py-6 px-24  z-10 flex flex-col gap-2 items-center justify-center border-dashed rounded-lg ${disabled ? 'border-2 border-[#7fab98] bg-[#7fab98]/15' : 'border-2 border-indigo-500  bg-[rgba(99,102,241,0.08)]'}`}
              >
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
              className={`py-6 px-24  z-10 flex flex-col gap-2 items-center justify-center rounded-lg border-dashed ${disabled ? 'border-2 border-[#7fab98] bg-[#7fab98]/15' : 'border-2 border-indigo-500 bg-[rgba(99,102,241,0.08)]'}`}
            >
              <FaCloudUploadAlt className='w-20 h-20 text-indigo-600' />
              <p className='text-base text-black'>
                Drag & Drop Files or <span>Browse</span>
              </p>
            </div>
          </>
        )}
      </div>

      {selectedFile &&
        createPortal(
          <ImageCropper
            file={selectedFile}
            onCropDone={onCropDone}
            onCropCancel={onCropCancel}
            handelImageUploadation={handelImageUploadation}
            loading={loading}
            croppedImagePreview={croppedImagePreview}
            cropShape={cropShape}
            maxCropHeight={maxCropHeight}
            maxCropWidth={maxCropWidth}
            setCroppedImagePreview={setCroppedImagePreview}
          />,
          document.body
        )}
    </>
  );
}

export default DragAndDropFileUploader;
