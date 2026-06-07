/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { SetStateAction, useState } from 'react';

import Cropper, { Area } from 'react-easy-crop';
import { BiSolidZoomIn, BiSolidZoomOut } from 'react-icons/bi';
import { FaRotateLeft, FaRotateRight } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';

import Loader from '@/components/common/Loader';
import HamsterSpinner from '@/components/loaders/HamsterSpinner';

function ImageCropper({
  file,
  onCropDone,
  onCropCancel,
  loading,
  croppedImagePreview,
  setCroppedImagePreview,
  cropShape,
  maxCropHeight,
  maxCropWidth,
  handelImageUploadation,
}: {
  file: File;
  onCropDone: (imageCroppedArea: any, rotation: number) => void;
  onCropCancel: () => void;
  loading: boolean;
  croppedImagePreview: string;
  setCroppedImagePreview: React.Dispatch<SetStateAction<string>>;
  cropShape: 'round' | 'rect';
  maxCropHeight: number;
  maxCropWidth: number;
  handelImageUploadation: (imageUrl: string) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedArea, setCroppedArea] = useState<Area>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const handelTryAgainButton = () => {
    setCroppedImagePreview('');
  };

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handelRotationRight = () => {
    setRotation((perv) => perv + 15);
  };
  const handelRotationLeft = () => {
    setRotation((perv) => perv - 15);
  };
  const handelZoomIn = () => {
    setZoom((perv) => perv + 0.5);
  };
  const handelZoomOut = () => {
    if (zoom == 0 || zoom == 0.5) return;
    setZoom((perv) => perv - 0.5);
  };

  const imageUrl = URL.createObjectURL(file);

  return (
    <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/25 z-[999] transition-all duration-200'>
      <div className='flex flex-col bg-white py-5 px-6  rounded-lg gap-5'>
        <div className='flex items-center justify-between'>
          <h2 className='text-black capitalize font-inter font-bold text-xl'>
            crop the photos
          </h2>
          <button className='bg-transparent border-0' onClick={onCropCancel}>
            <IoClose className='text-black text-3xl' />
          </button>
        </div>
        <div className='w-[550px] h-[450px] bg-white rounded-lg p-4 overflow-hidden relative'>
          {loading && (
            <div className='w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-md absolute top-0 left-0 z-20 transition-all duration-200'>
              <HamsterSpinner theme='light' />
            </div>
          )}
          {croppedImagePreview ? (
            <div className='w-full h-full flex items-center justify-center bg-black/10 rounded-md'>
              <img
                src={croppedImagePreview}
                className={`w-full h-full m-auto ${cropShape === 'round' ? 'rounded-full' : ''}`}
                alt='cropped Image Preview'
                loading='lazy'
                style={{ maxWidth: maxCropWidth, maxHeight: maxCropHeight }}
              />
            </div>
          ) : (
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              cropSize={{ width: maxCropWidth, height: maxCropHeight }}
              restrictPosition={false}
              cropShape={cropShape}
              objectFit='contain'
              style={{ containerStyle: { backgroundColor: 'transparent' } }}
            />
          )}
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
            {croppedImagePreview ? (
              <button
                className='bg-transparent text-black border border-black/60 px-4 py-1.5 capitalize font-inter text-base font-semibold rounded-lg h-full'
                onClick={handelTryAgainButton}
              >
                Try Again
              </button>
            ) : (
              <button
                className='bg-transparent text-black border border-black/60 px-4 py-1.5 capitalize font-inter text-base font-semibold rounded-lg h-full'
                onClick={onCropCancel}
              >
                cancel
              </button>
            )}

            {croppedImagePreview ? (
              <button
                className='bg-[var(--them-green-color)] text-white px-4 py-1.5 capitalize font-inter text-base font-semibold rounded-lg h-full disabled:opacity-70 disabled:cursor-not-allowed'
                onClick={() => handelImageUploadation(croppedImagePreview)}
                disabled={loading}
              >
                {loading ? (
                  <Loader loaderText='Uploading...' />
                ) : (
                  <span>Upload Image</span>
                )}
              </button>
            ) : (
              <button
                className='bg-[var(--them-green-color)] text-white px-4 py-1.5 capitalize font-inter text-base font-semibold rounded-lg h-full'
                onClick={() => onCropDone(croppedArea, rotation)}
              >
                Crop & Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCropper;
