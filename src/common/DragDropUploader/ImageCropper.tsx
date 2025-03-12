/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { BiSolidZoomIn, BiSolidZoomOut } from 'react-icons/bi';
import { FaRotateLeft, FaRotateRight } from 'react-icons/fa6';

function ImageCropper({
  file,
  onCropDone,
  onCropCancel,
}: {
  file: File;
  onCropDone: (imageCroppedArea: any) => void;
  onCropCancel: () => void;
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
    <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/25 z-[999]'>
      <div className='flex flex-col bg-white py-5 px-6  rounded-lg gap-5'>
        <h2 className='text-black capitalize font-inter font-bold text-xl'>
          crop the photos
        </h2>
        <div className='w-[550px] h-[450px] bg-white rounded-lg p-4 overflow-hidden relative'>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            cropSize={{ width: 300, height: 300 }}
            restrictPosition={false}
            cropShape='round'
            objectFit='contain'
            style={{ containerStyle: { backgroundColor: 'transparent' } }}
          />
        </div>
        <div className='flex items-stretch justify-between'>
          <div className='flex items-center gap-2 justify-end'>
            <div className='flex items-stretch justify-start gap-3'>
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
            <button
              className='bg-transparent text-black border border-black/60 px-4 py-1.5 capitalize font-inter text-base font-semibold rounded-lg h-full'
              onClick={onCropCancel}
            >
              cancel
            </button>
            <button
              className='bg-[var(--them-green-color)] text-white px-4 py-1.5 capitalize font-inter text-base font-semibold rounded-lg h-full'
              onClick={() => onCropDone(croppedArea)}
            >
              crop & upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCropper;
