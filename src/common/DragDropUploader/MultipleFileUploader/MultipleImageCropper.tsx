import React, { SetStateAction, useEffect, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { BiSolidZoomIn, BiSolidZoomOut } from 'react-icons/bi';
import { FaRotateLeft, FaRotateRight } from 'react-icons/fa6';
import { IoClose, IoCloseCircle } from 'react-icons/io5';

import HamsterLoader from '../../../Components/Loader/HamsterLoader';
import {
  classNames,
  createImageUtilFunction,
  dataUrlToFileConvertor,
  getBoundingBox,
  getRadianAngle,
} from '../../../Helper/HelperFunctions';
import { useDebounce } from '../../../Hooks/useDebounce';
import {
  SelectedFileArrayObjInterface,
  SelectedFileForCrop,
} from '../../../interface/interface';
import Loader from '../../Loader';

function MultipleImageCropper({
  DroppedFilesArray,
  setDroppedFilesArray,
  cropShape,
  maxCropHeight,
  maxCropWidth,
  handelImageUploadation,
  setIsImageCropperActive,
  imageProcessingLoader,
}: {
  DroppedFilesArray: SelectedFileArrayObjInterface[];
  setDroppedFilesArray: React.Dispatch<
    React.SetStateAction<SelectedFileArrayObjInterface[]>
  >;
  cropShape: 'round' | 'rect';
  maxCropHeight: number;
  maxCropWidth: number;
  handelImageUploadation: (fieData: SelectedFileArrayObjInterface[]) => void;
  setIsImageCropperActive?: React.Dispatch<SetStateAction<boolean>>;
  imageProcessingLoader: boolean;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [renderingImage, setRenderingImage] = useState<boolean>(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedArea, setCroppedArea] = useState<Area>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const [selectedFileObj, setSelectedFileObj] =
    useState<SelectedFileForCrop | null>(null);
  const [finalSelectedImageArray, setFinalSelectedImageArray] = useState<
    SelectedFileArrayObjInterface[]
  >([]);

  const onCropDone = (croppedArea: Area, rotation: number) => {
    setLoading(true);
    handelCropDoneDebounce(croppedArea, rotation);
  };

  const handelCropDoneDebounce = useDebounce(
    async (croppedArea: Area, rotation: number) => {
      if (!selectedFileObj) return;

      const imageUrl = URL.createObjectURL(selectedFileObj?.file);
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

      setSelectedFileObj((pervItem) => {
        if (!pervItem) return null;
        return { ...pervItem, croppedImagePreview: dataUrl };
      });

      setDroppedFilesArray((fileArray) => {
        if (!fileArray) return fileArray;

        const exists = fileArray?.some(
          (item) => item?.id == selectedFileObj?.id
        );

        if (!exists) return fileArray;

        return fileArray?.map((item) =>
          item?.id === selectedFileObj?.id
            ? { ...item, croppedImagePreview: dataUrl }
            : item
        );
      });

      setLoading(false);
    },
    100
  );
  const handelTryAgainButton = (selectedFileObj: SelectedFileForCrop) => {
    if (!selectedFileObj) return;
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setDroppedFilesArray((fileArray) => {
      if (!fileArray) return fileArray;

      const exists = fileArray?.some((item) => item?.id == selectedFileObj?.id);

      if (!exists) return fileArray;

      return fileArray?.map((item) =>
        item?.id === selectedFileObj?.id
          ? { ...item, croppedImagePreview: '' }
          : item
      );
    });

    setSelectedFileObj((pervValue) => {
      if (!pervValue) return pervValue;
      return { ...pervValue, croppedImagePreview: '' };
    });
  };

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handelRotationRight = () => {
    setRotation((perv) => perv + 30);
  };
  const handelRotationLeft = () => {
    setRotation((perv) => perv - 30);
  };
  const handelZoomIn = () => {
    setZoom((perv) => perv + 0.5);
  };
  const handelZoomOut = () => {
    if (zoom == 0 || zoom == 0.5) return;
    setZoom((perv) => perv - 0.5);
  };

  const handelClickOnImage = (file: SelectedFileArrayObjInterface) => {
    setRenderingImage(true);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setTimeout(() => {
      const previewUrl = URL.createObjectURL(file?.file);
      setSelectedFileObj({
        id: file?.id,
        file: file?.file,
        previewUrl: previewUrl,
        croppedImagePreview: file?.croppedImagePreview,
        originalFile: file.originalFile,
      });
      setRenderingImage(false);
    }, 150);
  };

  const onCropCancel = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setDroppedFilesArray([]);
    if (setIsImageCropperActive) setIsImageCropperActive(false);
  };

  const handelClickOnSaveButton = (data: SelectedFileForCrop) => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    const file = dataUrlToFileConvertor(
      data.croppedImagePreview,
      `image-${Math.random()}.png`
    );

    setFinalSelectedImageArray((prevData) => {
      const exists = prevData?.some((item) => item?.id === data?.id);
      if (exists) {
        return prevData?.map((item) =>
          item?.id === data?.id
            ? {
                id: data?.id,
                croppedImagePreview: data?.croppedImagePreview,
                file: file,
                originalFile: item.originalFile,
              }
            : item
        );
      }
      return [...(prevData || []), { ...data, file }];
    });

    const filteredData = DroppedFilesArray?.filter((item) => {
      if (item?.id === data?.id) return false;
      const alreadyExist = finalSelectedImageArray?.some(
        (data) => data?.id === item?.id
      );
      return !alreadyExist;
    });

    if (filteredData?.length >= 1) {
      const previewUrl = URL.createObjectURL(filteredData[0]?.file);
      setSelectedFileObj({
        id: filteredData[0]?.id,
        file: filteredData[0]?.file,
        previewUrl: previewUrl,
        croppedImagePreview: filteredData[0]?.croppedImagePreview,
        originalFile: filteredData[0]?.originalFile,
      });
    }
  };

  const handelClickOnTheDeleteBtn = (id: string) => {
    setRenderingImage(true);
    const updatedDroppedFiles =
      DroppedFilesArray?.filter((item) => item?.id !== id) || [];

    setDroppedFilesArray(updatedDroppedFiles);

    const updatedFinalArray =
      finalSelectedImageArray?.filter((item) => item?.id !== id) || [];

    setFinalSelectedImageArray(updatedFinalArray);

    const isSelected = selectedFileObj?.id === id;

    setTimeout(() => {
      if (isSelected) {
        setSelectedFileObj(null);
        if (updatedDroppedFiles?.length > 0) {
          const file = updatedDroppedFiles[0];
          const previewUrl = URL.createObjectURL(file.file);

          setSelectedFileObj({
            id: file?.id,
            file: file?.file,
            previewUrl: previewUrl,
            croppedImagePreview: file.croppedImagePreview || '',
            originalFile: file?.originalFile,
          });
        }
      }
      setRenderingImage(false);
    }, 300);
  };

  useEffect(() => {
    if (!selectedFileObj && DroppedFilesArray?.length !== 0) {
      console.log(DroppedFilesArray);
      const previewUrl = URL.createObjectURL(DroppedFilesArray[0]?.file);
      setSelectedFileObj({
        id: DroppedFilesArray[0]?.id,
        file: DroppedFilesArray[0]?.file,
        previewUrl: previewUrl,
        croppedImagePreview: DroppedFilesArray[0]?.croppedImagePreview,
        originalFile: DroppedFilesArray[0]?.originalFile,
      });
    }
  }, [DroppedFilesArray, selectedFileObj]);

  console.log(imageProcessingLoader);

  return (
    <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/25 z-[999] transition-all duration-200'>
      <div className='flex flex-col bg-white py-5 px-6 w-full max-w-[650px] rounded-lg gap-5'>
        <div className='flex items-center justify-between'>
          <h2 className='text-black capitalize font-inter font-bold text-xl'>
            crop the photos
          </h2>
          <button className='bg-transparent border-0' onClick={onCropCancel}>
            <IoClose className='text-black text-3xl' />
          </button>
        </div>
        <div className='w-[450px] h-[400px] m-auto bg-white rounded-lg p-4 overflow-hidden relative'>
          {imageProcessingLoader ? (
            <div className='w-full h-full flex flex-col-reverse items-center justify-center bg-white backdrop-blur-md absolute top-0 left-0 z-20 transition-all duration-200 gap-8'>
              <p className='text-black font-medium text-lg animate-bounce'>
                Wait, we are processing your images...
              </p>

              <HamsterLoader theme='dark' />
            </div>
          ) : (
            <>
              {loading && (
                <div className='w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-md absolute top-0 left-0 z-20 transition-all duration-200'>
                  <HamsterLoader theme='light' />
                </div>
              )}
              {selectedFileObj && (
                <>
                  {renderingImage ? (
                    <div className='w-full h-full flex flex-col-reverse items-center justify-center bg-white backdrop-blur-md absolute top-0 left-0 z-20 transition-all duration-200 gap-8'>
                      <p className='text-black font-medium text-lg animate-bounce'>
                        Loading...
                      </p>

                      <HamsterLoader theme='dark' />
                    </div>
                  ) : (
                    <>
                      {selectedFileObj?.croppedImagePreview ? (
                        <div className='w-full h-full flex items-center justify-center bg-black/10 rounded-md overflow-hidden'>
                          <img
                            src={selectedFileObj?.croppedImagePreview}
                            className={`w-full h-full m-auto ${cropShape === 'round' ? 'rounded-full' : 'rounded-md'}`}
                            alt='cropped Image Preview'
                            loading='lazy'
                            style={{
                              maxWidth: maxCropWidth,
                              maxHeight: maxCropHeight,
                            }}
                          />
                        </div>
                      ) : (
                        <Cropper
                          image={selectedFileObj?.previewUrl}
                          crop={crop}
                          zoom={zoom}
                          rotation={rotation}
                          onCropChange={setCrop}
                          onCropComplete={onCropComplete}
                          onZoomChange={setZoom}
                          onRotationChange={setRotation}
                          cropSize={{
                            width: maxCropWidth,
                            height: maxCropHeight,
                          }}
                          restrictPosition={false}
                          cropShape={cropShape}
                          objectFit='contain'
                          style={{
                            containerStyle: { backgroundColor: 'transparent' },
                          }}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
        <div className='flex items-center justify-start overflow-auto hide-scrollbar flex-nowrap gap-4 pt-6 px-3 border-t border-black/20'>
          {DroppedFilesArray?.map((file) => {
            const previewUrl = file?.croppedImagePreview
              ? file?.croppedImagePreview
              : URL.createObjectURL(file?.file);

            return (
              <div
                className={classNames(
                  'min-w-[80px] max-w-[80px] max-h-[80px] min-h-[80px] rounded-lg border border-black/20 relative',
                  {
                    'border-2 border-blue-500':
                      file?.id === selectedFileObj?.id,
                  }
                )}
                onClick={() => handelClickOnImage(file)}
                key={file?.id}
              >
                <button
                  className='min-w-5 min-h-5 max-w-5 max-h-5 absolute -top-1.5 -left-1.5 text-black rounded-full bg-white'
                  onClick={() => handelClickOnTheDeleteBtn(file?.id)}
                >
                  <IoCloseCircle className='min-w-5 min-h-5 max-w-5 max-h-5' />
                </button>
                <img
                  src={previewUrl}
                  alt='Drag Drop Preview Url'
                  width={76}
                  height={76}
                  loading='lazy'
                  className='w-full h-full aspect-square p-1 object-cover rounded-lg'
                />
              </div>
            );
          })}
        </div>
        <div className='flex items-stretch justify-between'>
          <div className='flex items-center gap-2 justify-between'>
            <div className='flex items-stretch w-full justify-between gap-3'>
              <div className='flex items-stretch'>
                <button
                  className='text-black px-2.5 bg-slate-100 border border-black/30 border-r-0 rounded-l-md'
                  onClick={handelZoomOut}
                >
                  <BiSolidZoomOut className='w-6 h-5' />
                </button>
                <button
                  className='text-black px-2.5  bg-slate-100 border border-black/30  rounded-r-md'
                  onClick={handelZoomIn}
                >
                  <BiSolidZoomIn className='w-6 h-5' />
                </button>
              </div>
              <div className='flex items-stretch'>
                <button
                  className='text-black p-3 bg-slate-100 border border-black/30 border-r-0 rounded-l-md'
                  onClick={handelRotationLeft}
                >
                  <FaRotateLeft />
                </button>
                <button
                  className='text-black p-3 bg-slate-100 border border-black/30  rounded-r-md'
                  onClick={handelRotationRight}
                >
                  <FaRotateRight />
                </button>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2 justify-end'>
            {selectedFileObj?.croppedImagePreview ? (
              <button
                className='bg-transparent text-black border border-black/60 px-4 py-1.5 capitalize font-inter text-base font-semibold rounded-lg h-full'
                onClick={() => handelTryAgainButton(selectedFileObj)}
              >
                Crop Again
              </button>
            ) : (
              <button
                className='bg-transparent text-black border border-black/60 px-4 py-1.5 capitalize font-inter text-base font-semibold rounded-lg h-full'
                onClick={onCropCancel}
              >
                cancel
              </button>
            )}

            {DroppedFilesArray?.length == finalSelectedImageArray?.length ? (
              <button
                className='bg-[var(--them-green-color)] text-white px-4 py-1.5 capitalize font-inter text-base font-semibold rounded-lg h-full'
                onClick={() => handelImageUploadation(finalSelectedImageArray)}
              >
                Done
              </button>
            ) : (
              <>
                {selectedFileObj?.croppedImagePreview ? (
                  <button
                    className='bg-[var(--them-green-color)] text-white px-4 py-1.5 capitalize font-inter text-base font-semibold rounded-lg h-full disabled:opacity-70 disabled:cursor-not-allowed'
                    onClick={() => handelClickOnSaveButton(selectedFileObj)}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader loaderText='Uploading...' />
                    ) : (
                      <span>Save</span>
                    )}
                  </button>
                ) : (
                  <button
                    className='bg-[var(--them-green-color)] text-white px-4 py-1.5 capitalize font-inter text-base font-semibold rounded-lg h-full disabled:opacity-70 disabled:cursor-not-allowed'
                    onClick={() => onCropDone(croppedArea, rotation)}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader loaderText='Cropping...' />
                    ) : (
                      <span>Crop & Continue</span>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultipleImageCropper;
